import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Test route with system information
// @route   GET /api/test
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get database connection status
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Get environment info
    const envInfo = {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
      dbConnected: dbStatus === 1,
      dbStatus: dbStatusText[dbStatus] || 'unknown'
    };

    // Get current time
    const currentTime = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Backend is running successfully! 🚀',
      timestamp: currentTime,
      environment: envInfo,
      api: {
        baseUrl: req.protocol + '://' + req.get('host'),
        availableEndpoints: [
          'GET /api/health - Health check',
          'GET /api/test - This test endpoint',
          'POST /api/leads/create - Create lead',
          'GET /api/leads - Get leads (auth required)',
          'POST /api/auth/login - Login',
          'GET /api/auth/me - Get current user (auth required)'
        ]
      },
      tips: [
        'Use http://localhost:5173/test to test frontend connection',
        'Use http://localhost:5000/api/health for health check',
        'Use http://localhost:5000/api/test for this test endpoint',
        'Create admin user with: node scripts/seedAdmin.js'
      ]
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({
      success: false,
      message: 'Test route error',
      error: error.message
    });
  }
});

export default router;
