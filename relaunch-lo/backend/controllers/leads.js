import Lead from '../models/Lead.js';
import User from '../models/User.js';
import { validateLeadData } from '../utils/validation.js';

// @desc    Create new lead
// @route   POST /api/leads/create
// @access  Public (for form submissions)
export const createLead = async (req, res, next) => {
  try {
    console.log('Received lead data:', req.body);
    const { error, value } = validateLeadData(req.body);
    
    if (error) {
      console.log('Validation errors:', error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      })));
      return res.status(400).json({
        success: false,
        message: 'Validierungsfehler',
        errors: error.details.map(detail => detail.message)
      });
    }

    const leadData = value;

    // Check if lead with this email already exists
    const existingLead = await Lead.findOne({ 
      email: leadData.email,
      source: leadData.source 
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: 'Ein Lead mit dieser E-Mail und Quelle existiert bereits'
      });
    }

    // Create or get user for this lead
    const user = await User.createLeadUser({
      name: leadData.name,
      email: leadData.email,
      company: leadData.company?.name
    });

    // Create the lead
    const lead = await Lead.create({
      ...leadData,
      user: user._id,
      privacyConsent: true
    });

    await lead.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead erfolgreich erstellt',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin/User)
export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      source,
      priority,
      leadType,
      assignedTo,
      search,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (status) query.status = status;
    if (source) query.source = source;
    if (priority) query.priority = priority;
    if (leadType) query.leadType = leadType;
    if (assignedTo) query.assignedTo = assignedTo;

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } }
      ];
    }

    // If user is not admin, only show their assigned leads or leads they created
    if (req.user.role !== 'admin') {
      query.$or = [
        { assignedTo: req.user.id },
        { user: req.user.id }
      ];
    }

    const leads = await Lead.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('user', 'name email profile')
      .populate('assignedTo', 'name email')
      .populate('communications.userId', 'name email')
      .populate('tasks.assignedTo', 'name email')
      .populate('tasks.createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        lead.assignedTo?.toString() !== req.user.id.toString() &&
        lead.user?.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert, diesen Lead zu sehen'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private (Admin/User)
export const updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        lead.assignedTo?.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert, diesen Lead zu bearbeiten'
      });
    }    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('communications.userId', 'name email');

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Soft delete
    lead.isActive = false;
    lead.archivedAt = new Date();
    lead.archivedBy = req.user.id;
    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead archiviert'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leads by status
// @route   GET /api/leads/by-status
// @access  Private (Admin/User)
export const getLeadsByStatus = async (req, res, next) => {
  try {
    const query = { isActive: true };

    // If user is not admin, only show their leads
    if (req.user.role !== 'admin') {
      query.$or = [
        { assignedTo: req.user.id },
        { user: req.user.id }
      ];
    }

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$estimatedValue' },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { count: -1 } }
    ];

    const results = await Lead.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Private (Admin/User)
export const getLeadStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      isActive: true,
      createdAt: { $gte: startDate }
    };

    // If user is not admin, only show their leads
    if (req.user.role !== 'admin') {
      query.$or = [
        { assignedTo: req.user.id },
        { user: req.user.id }
      ];
    }

    const [totalLeads, statusStats, sourceStats, conversionStats] = await Promise.all([
      Lead.countDocuments(query),
      Lead.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: query },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]),
      Lead.getConversionStats(parseInt(days))
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusStats,
        sourceStats,
        conversionStats: conversionStats[0] || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add communication to lead
// @route   POST /api/leads/:id/communication
// @access  Private (Admin/User)
export const addCommunication = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }    const communication = {
      ...req.body,
      userId: req.user.id,
      date: new Date()
    };

    await lead.addCommunication(communication);

    // Re-fetch the lead with populated fields
    const updatedLead = await Lead.findById(lead._id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('communications.userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Kommunikation hinzugefügt',
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add task to lead
// @route   POST /api/leads/:id/task
// @access  Private (Admin/User)
export const addTask = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    const task = {
      ...req.body,
      createdBy: req.user.id,
      assignedTo: req.body.assignedTo || req.user.id
    };

    await lead.addTask(task);

    res.status(200).json({
      success: true,
      message: 'Aufgabe hinzugefügt',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private (Admin/User)
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    await lead.updateStatus(status, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Status aktualisiert',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leads assigned to current user
// @route   GET /api/leads/my-leads
// @access  Private
export const getMyLeads = async (req, res, next) => {
  try {
    const { status, priority } = req.query;

    const query = {
      isActive: true,
      $or: [
        { assignedTo: req.user.id },
        { user: req.user.id }
      ]
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const leads = await Lead.find(query)
      .populate('user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign lead to user
// @route   PATCH /api/leads/:id/assign
// @access  Private (Admin only)
export const assignLead = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead zugewiesen',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update leads
// @route   PATCH /api/leads/bulk-update
// @access  Private (Admin/User)
export const bulkUpdateLeads = async (req, res, next) => {
  try {
    const { leadIds, updates } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lead IDs sind erforderlich'
      });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds }, isActive: true },
      updates
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} Leads aktualisiert`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads
// @route   GET /api/leads/export
// @access  Private (Admin/User)
export const exportLeads = async (req, res, next) => {
  try {
    const { format = 'json', ...filters } = req.query;

    const query = { isActive: true, ...filters };

    // If user is not admin, only show their leads
    if (req.user.role !== 'admin') {
      query.$or = [
        { assignedTo: req.user.id },
        { user: req.user.id }
      ];
    }

    const leads = await Lead.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    if (format === 'csv') {
      // For CSV export, you would implement CSV conversion here
      // For now, returning JSON with CSV headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    }

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead activities
// @route   GET /api/leads/:id/activities
// @access  Private (Admin/User)
export const getLeadActivities = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('communications.userId', 'name email')
      .populate('tasks.assignedTo', 'name email')
      .populate('tasks.createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Combine communications and tasks into activities timeline
    const activities = [
      ...lead.communications.map(comm => ({
        type: 'communication',
        ...comm.toObject(),
        timestamp: comm.date
      })),
      ...lead.tasks.map(task => ({
        type: 'task',
        ...task.toObject(),
        timestamp: task.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload attachment to lead via S3
// @route   POST /api/leads/:id/attachments
// @access  Private (Admin/User)
export const uploadAttachment = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        lead.assignedTo?.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert, Dateien zu diesem Lead hinzuzufügen'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Keine Datei hochgeladen'
      });
    }

    // Add artificial delay in development to see upload progress
    if (process.env.NODE_ENV === 'development') {
      console.log('Adding artificial delay for upload progress visibility...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }

    // Import S3 upload function
    const { uploadToS3 } = await import('../config/upload.js');
    
    // Generate unique filename
    const fileName = `leadgenpro-attachments/${Date.now()}-${Math.round(Math.random() * 1E9)}-${req.file.originalname}`;
    
    // Upload to S3
    const s3Result = await uploadToS3(req.file, fileName);    // S3 Upload erfolgreich, erstelle Attachment
    const attachment = {
      filename: s3Result.Key,
      originalName: req.file.originalname,
      url: s3Result.Location,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id,
      uploadedAt: new Date()
    };

    lead.attachments.push(attachment);
    await lead.save();

    // Re-fetch the lead with populated fields
    const updatedLead = await Lead.findById(lead._id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('communications.userId', 'name email')
      .populate('attachments.uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Datei erfolgreich hochgeladen',
      data: updatedLead
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Fehler beim Hochladen der Datei',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Download attachment from S3
// @route   GET /api/leads/:id/attachments/:attachmentId/download
// @access  Private (Admin/User)
export const downloadAttachment = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        lead.assignedTo?.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert, Dateien dieses Leads herunterzuladen'
      });
    }

    // Find the attachment
    const attachment = lead.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Datei nicht gefunden'
      });
    }

    // Import S3 client
    const { s3 } = await import('../config/upload.js');
    
    // S3 download parameters
    const downloadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: attachment.filename
    };

    try {
      // Get file from S3
      const s3Object = await s3.getObject(downloadParams).promise();
      
      // Set proper headers for file download
      res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${attachment.originalName}"`);
      res.setHeader('Content-Length', s3Object.ContentLength);
      
      // Send file buffer
      res.send(s3Object.Body);
      
    } catch (s3Error) {
      console.error('S3 Download Error:', s3Error);
      return res.status(404).json({
        success: false,
        message: 'Datei konnte nicht von S3 abgerufen werden'
      });
    }

  } catch (error) {
    console.error('Download error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Fehler beim Herunterladen der Datei',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete attachment from lead and S3
// @route   DELETE /api/leads/:id/attachments/:attachmentId
// @access  Private (Admin only)
export const deleteAttachment = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead nicht gefunden'
      });
    }

    // Only admins can delete attachments
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Nur Administratoren können Dateien löschen'
      });
    }

    // Find the attachment
    const attachment = lead.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Datei nicht gefunden'
      });
    }

    // Import S3 client
    const { s3 } = await import('../config/upload.js');
    
    // Delete from S3
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: attachment.filename
    };

    try {
      await s3.deleteObject(deleteParams).promise();
      console.log(`File deleted from S3: ${attachment.filename}`);
    } catch (s3Error) {
      console.error('S3 Delete Error:', s3Error);
      // Continue with database deletion even if S3 delete fails
    }

    // Remove from database
    lead.attachments.pull(req.params.attachmentId);
    await lead.save();

    // Re-fetch the lead with populated fields
    const updatedLead = await Lead.findById(lead._id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('communications.userId', 'name email')
      .populate('attachments.uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Datei erfolgreich gelöscht',
      data: updatedLead
    });

  } catch (error) {
    console.error('Delete attachment error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen der Datei',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
