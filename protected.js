const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/protected/profile
 * @desc    Get user profile (protected route)
 * @access  Private
 */
router.get('/profile', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile accessed successfully',
      data: {
        user: req.user,
        message: 'This is a protected route. You can only see this if you have a valid JWT token.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accessing profile'
    });
  }
});

/**
 * @route   GET /api/protected/dashboard
 * @desc    Get user dashboard (protected route)
 * @access  Private
 */
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    // Simulate dashboard data
    const dashboardData = {
      user: req.user,
      stats: {
        totalPosts: 15,
        totalLikes: 234,
        totalComments: 89
      },
      recentActivity: [
        { id: 1, action: 'Created a new post', timestamp: new Date().toISOString() },
        { id: 2, action: 'Liked a post', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'Commented on a post', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ]
    };

    res.json({
      success: true,
      message: 'Dashboard accessed successfully',
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accessing dashboard'
    });
  }
});

/**
 * @route   POST /api/protected/update-profile
 * @desc    Update user profile (protected route)
 * @access  Private
 */
router.post('/update-profile', authenticateToken, (req, res) => {
  try {
    const { bio, location, website } = req.body;

    // In a real application, you would update the user in the database
    // For now, we'll just return the updated data
    const updatedProfile = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      bio: bio || 'No bio provided',
      location: location || 'No location provided',
      website: website || 'No website provided',
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

/**
 * @route   GET /api/protected/settings
 * @desc    Get user settings (protected route)
 * @access  Private
 */
router.get('/settings', authenticateToken, (req, res) => {
  try {
    // Simulate user settings
    const userSettings = {
      userId: req.user.id,
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        allowMessages: true
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC'
      }
    };

    res.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: userSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving settings'
    });
  }
});

/**
 * @route   POST /api/protected/logout
 * @desc    Logout user (protected route)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Clear any server-side sessions
    // 3. Update user's last logout time
    
    res.json({
      success: true,
      message: 'Logout successful. Please delete the token from your client-side storage.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
});

module.exports = router; 