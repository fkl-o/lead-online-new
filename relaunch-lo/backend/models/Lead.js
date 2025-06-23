import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  // Basic Lead Information
  name: {
    type: String,
    required: [true, 'Name ist erforderlich'],
    trim: true,
    maxlength: [100, 'Name darf nicht länger als 100 Zeichen sein']
  },
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    ]
  },
  salutation: {
    type: String,
    enum: ['herr', 'frau'],
    required: [true, 'Anrede ist erforderlich']
  },
  
  // Lead Source and Type
  source: {
    type: String,
    enum: ['automation', 'digitalization', 'website', 'contact', 'manual'],
    required: [true, 'Lead-Quelle ist erforderlich']
  },
  leadType: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm'
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost', 'nurturing'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Company Information
  company: {
    name: String,
    website: String,
    industry: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    }
  },
  
  // Contact Information
  phone: String,
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Deutschland'
    }
  },
  
  // Service-specific Data
  serviceDetails: {
    // Marketing Automation specifics
    automation: {
      monthlyBudget: Number,
      conversionRate: Number,
      marginPerSale: Number,
      roiProjection: Number,
      estimatedProfit: Number
    },
    
    // Digitalization specifics
    digitalization: {
      areas: [String], // ['Marketing', 'Vertrieb', 'Kundenservice', etc.]
      urgency: {
        type: String,
        enum: ['sofort', '1-3 Monate', '3-6 Monate']
      },
      currentChallenges: [String]
    },
    
    // Website specifics
    website: {
      currentUrl: String,
      goals: [String], // ['Mehr Leads', 'Bessere Conversion', etc.]
      style: String, // 'modern', 'classic', etc.
      timeline: String,
      budget: String
    }
  },
  
  // Lead Scoring and Analytics
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  estimatedValue: {
    type: Number,
    default: 0
  },
  
  // Communication History
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'meeting', 'proposal', 'follow-up'],
      required: true
    },
    subject: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      default: 'outbound'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Tasks and Follow-ups
  tasks: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    dueDate: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: Date
  }],
  
  // Tracking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastContactDate: Date,
  nextFollowUp: Date,
  
  // Privacy and Consent
  privacyConsent: {
    type: Boolean,
    required: true,
    default: true
  },
  marketingConsent: {
    type: Boolean,
    default: false
  },
  consentDate: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  notes: String,
  tags: [String],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // System fields
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: Date,
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ leadType: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ score: -1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ user: 1 });
leadSchema.index({ 'company.name': 'text', 'name': 'text', 'email': 'text' });

// Virtual for full name
leadSchema.virtual('fullName').get(function() {
  const salutationText = this.salutation === 'herr' ? 'Herr' : 'Frau';
  return `${salutationText} ${this.name}`;
});

// Virtual for days since created
leadSchema.virtual('daysSinceCreated').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for days since last contact
leadSchema.virtual('daysSinceLastContact').get(function() {
  if (!this.lastContactDate) return null;
  return Math.floor((Date.now() - this.lastContactDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate lead score
leadSchema.pre('save', function(next) {
  let score = 50; // Base score
  
  // Score based on source
  const sourceScores = {
    'automation': 80,
    'digitalization': 75,
    'website': 70,
    'contact': 60,
    'manual': 50
  };
  score += (sourceScores[this.source] - 50) * 0.3;
  
  // Score based on company size
  if (this.company?.size) {
    const sizeScores = {
      '1-10': 60,
      '11-50': 70,
      '51-200': 80,
      '201-500': 90,
      '500+': 95
    };
    score += (sizeScores[this.company.size] - 50) * 0.2;
  }
  
  // Score based on estimated value
  if (this.estimatedValue > 0) {
    score += Math.min(20, this.estimatedValue / 1000);
  }
  
  // Score based on urgency (for digitalization)
  if (this.serviceDetails?.digitalization?.urgency === 'sofort') {
    score += 15;
  } else if (this.serviceDetails?.digitalization?.urgency === '1-3 Monate') {
    score += 10;
  }
  
  this.score = Math.min(100, Math.max(0, Math.round(score)));
  next();
});

// Static method to get leads by status
leadSchema.statics.getLeadsByStatus = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$estimatedValue' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Static method to get conversion statistics
leadSchema.statics.getConversionStats = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalLeads: { $sum: 1 },
        wonLeads: {
          $sum: {
            $cond: [{ $eq: ['$status', 'closed-won'] }, 1, 0]
          }
        },
        lostLeads: {
          $sum: {
            $cond: [{ $eq: ['$status', 'closed-lost'] }, 1, 0]
          }
        },
        totalValue: { $sum: '$estimatedValue' },
        wonValue: {
          $sum: {
            $cond: [{ $eq: ['$status', 'closed-won'] }, '$estimatedValue', 0]
          }
        }
      }
    },
    {
      $project: {
        totalLeads: 1,
        wonLeads: 1,
        lostLeads: 1,
        totalValue: 1,
        wonValue: 1,
        conversionRate: {
          $multiply: [
            { $divide: ['$wonLeads', '$totalLeads'] },
            100
          ]
        }
      }
    }
  ]);
};

// Method to add communication
leadSchema.methods.addCommunication = function(commData) {
  this.communications.push(commData);
  this.lastContactDate = new Date();
  return this.save();
};

// Method to add task
leadSchema.methods.addTask = function(taskData) {
  this.tasks.push(taskData);
  return this.save();
};

// Method to update status
leadSchema.methods.updateStatus = function(newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add communication entry for status change
  this.communications.push({
    type: 'follow-up',
    subject: 'Status geändert',
    content: `Status von "${oldStatus}" zu "${newStatus}" geändert`,
    userId: userId
  });
  
  this.lastContactDate = new Date();
  return this.save();
};

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
