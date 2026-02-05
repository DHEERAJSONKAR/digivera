const User = require('../models/User');
const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const Subscription = require('../models/Subscription');
const path = require('path');
const fs = require('fs');

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
        profilePhoto: user.profilePhoto || null,
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
    const { name, email, phoneNumber, currentPassword, newPassword } = req.body;

    // Find user with password field (needed for password change)
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Handle password change if requested
    if (newPassword) {
      // Validate current password is provided
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password',
        });
      }

      // Verify current password (only if user has password - not for Google OAuth users)
      if (user.password) {
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect',
          });
        }
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters',
        });
      }

      // Update password (will be hashed by pre-save middleware)
      user.password = newPassword;
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
      message: newPassword ? 'Profile and password updated successfully' : 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        plan: user.plan,
        reputationScore: user.reputationScore,
        profilePhoto: user.profilePhoto || null,
        createdAt: user.createdAt,
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

// @desc    Upload profile photo
// @route   POST /api/me/photo
// @access  Private
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete old profile photo if exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '../../uploads/profiles', path.basename(user.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Save new photo path (relative URL)
    user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Upload profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile photo',
      error: error.message,
    });
  }
};

// @desc    Delete profile photo
// @route   DELETE /api/me/photo
// @access  Private
const deleteProfilePhoto = async (req, res) => {
  try {
    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.profilePhoto) {
      return res.status(400).json({
        success: false,
        message: 'No profile photo to delete',
      });
    }

    // Delete photo file
    const photoPath = path.join(__dirname, '../../uploads/profiles', path.basename(user.profilePhoto));
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    // Remove photo from database
    user.profilePhoto = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo deleted successfully',
      data: {
        profilePhoto: null,
      },
    });
  } catch (error) {
    console.error('Delete profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile photo',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
};
