import User from '../models/User.js';
import Lead from '../models/Lead.js';
import { validateUserCreation } from '../utils/validation.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('leads');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin only)
export const createUser = async (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`\n=== CREATE USER REQUEST ${timestamp} ===`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers.authorization ? 'Authorization present' : 'No authorization');
    console.log('User agent:', req.headers['user-agent']?.slice(0, 50));
    
    // Check if request body is empty or malformed
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ Empty request body!');
      return res.status(400).json({
        success: false,
        message: 'Request body ist leer'
      });
    }
    
    // Validate input data
    console.log('🔍 Starting validation...');
    const { error, value } = validateUserCreation(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details.map(d => `${d.path.join('.')}: ${d.message}`));
      return res.status(400).json({
        success: false,
        message: 'Validierungsfehler',
        errors: error.details.map(detail => detail.message)
      });
    }

    console.log('✅ Validation passed');    console.log('📦 Validated data:', JSON.stringify(value, null, 2));

    const { name, email, password, salutation, role, profile } = value;

    console.log(`🔍 Checking if user exists: ${email}`);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User already exists: ${email} (ID: ${existingUser._id})`);
      return res.status(400).json({
        success: false,
        message: 'Benutzer mit dieser E-Mail existiert bereits'
      });
    }

    console.log('✅ Email is unique, creating user...');
    const userData = {
      name,
      email,
      password,
      salutation,
      role,
      profile,
      isActive: true
    };
    console.log('👤 Creating user with data:', JSON.stringify(userData, null, 2));
    
    const user = await User.create(userData);
    console.log(`🎉 User created successfully! ID: ${user._id}`);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Benutzer erfolgreich erstellt',
      data: user
    });
  } catch (error) {
    console.error('💥 Create user error:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      isActive: req.body.isActive,
      profile: req.body.profile,
      preferences: req.body.preferences
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }

    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Der letzte Admin kann nicht gelöscht werden'
        });
      }
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Benutzer deaktiviert'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete user (Hard delete)
// @route   DELETE /api/users/:id/permanent
// @access  Private (Admin only)
export const permanentDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }

    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Der letzte Admin kann nicht gelöscht werden'
        });
      }
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Sie können sich nicht selbst löschen'
      });
    }

    // Hard delete - remove from database completely
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Benutzer permanent gelöscht'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin only)
export const getUserStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email role createdAt')
    ]);

    // Get lead assignment stats
    const leadStats = await Lead.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userName: '$user.name',
          userEmail: '$user.email',
          leadCount: '$count'
        }
      },
      {
        $sort: { leadCount: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        usersByRole,
        recentUsers,
        leadAssignments: leadStats
      }
    });
  } catch (error) {
    next(error);
  }
};
