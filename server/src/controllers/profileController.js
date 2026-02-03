const User = require('../models/User');
const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const Subscription = require('../models/Subscription');

// @desc    Get logged-in user profile
// @route   GET /api/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    // User already attached by authMiddleware (protect)
    const user = await User.findById(req.user._id).select('-password -phoneOtpHash -resetPasswordToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        googleId: user.googleId || null,
        plan: user.plan,
        reputationScore: user.reputationScore,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update only allowed fields
    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      // Check if email already exists (excluding current user)
      if (email) {
        const emailExists = await User.findOne({ 
          email, 
          _id: { $ne: user._id } 
        });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use',
          });
        }
      }
      user.email = email;
    }

    if (phoneNumber !== undefined) {
      // Check if phone already exists (excluding current user)
      if (phoneNumber) {
        const phoneExists = await User.findOne({ 
          phoneNumber, 
          _id: { $ne: user._id } 
        });

        if (phoneExists) {
          return res.status(400).json({
            success: false,
            message: 'Phone number already in use',
          });
        }
      }
      user.phoneNumber = phoneNumber;
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        plan: user.plan,
        reputationScore: user.reputationScore,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Delete user profile and all related data
// @route   DELETE /api/me
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete all related data (cascading delete)
    await Promise.all([
      // Delete all scans
      Scan.deleteMany({ userId }),
      
      // Delete all alerts
      Alert.deleteMany({ userId }),
      
      // Delete all subscriptions
      Subscription.deleteMany({ userId }),
      
      // Delete user
      User.findByIdAndDelete(userId),
    ]);

    res.status(200).json({
      success: true,
      message: 'Profile and all related data deleted successfully',
      data: {
        deletedUserId: userId,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
