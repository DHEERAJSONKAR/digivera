const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login/Signup
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Validate input
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required',
      });
    }

    // Verify Google ID token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error('Google token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      });
    }

    // Extract user info from verified token
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google',
      });
    }

    // Check if user exists by email
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists - check if Google ID needs to be added
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save({ validateBeforeSave: false });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          reputationScore: user.reputationScore,
          token,
        },
      });
    }

    // User doesn't exist - create new user
    user = await User.create({
      name: name || 'Google User',
      email: email.toLowerCase(),
      googleId,
      plan: 'free',
      // Password not required for Google users
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        reputationScore: user.reputationScore,
        token,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: error.message,
    });
  }
};

module.exports = {
  googleLogin,
};
