const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendSms = require('../utils/sendSms');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Store OTP request attempts (in-memory for simplicity, use Redis in production)
const otpRequestTracker = new Map();

// Helper: Check rate limit (max 3 OTP requests per hour per phone)
const checkRateLimit = (phoneNumber) => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (!otpRequestTracker.has(phoneNumber)) {
    otpRequestTracker.set(phoneNumber, []);
  }
  
  const requests = otpRequestTracker.get(phoneNumber);
  
  // Remove requests older than 1 hour
  const recentRequests = requests.filter(timestamp => now - timestamp < oneHour);
  otpRequestTracker.set(phoneNumber, recentRequests);
  
  // Check if limit exceeded
  if (recentRequests.length >= 3) {
    return false;
  }
  
  // Add current request
  recentRequests.push(now);
  otpRequestTracker.set(phoneNumber, recentRequests);
  
  return true;
};

// Helper: Validate phone number format
const validatePhoneNumber = (phoneNumber) => {
  // Basic validation: 10-15 digits, may start with +
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phoneNumber);
};

// Helper: Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/phone/send-otp
// @access  Public
const sendPhoneOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate input
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number',
      });
    }

    // Validate phone format
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
      });
    }

    // Check rate limit
    if (!checkRateLimit(phoneNumber)) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 1 hour.',
      });
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber }).select('+phoneOtpHash');

    // Always return same message for security (don't reveal if phone exists)
    const securityMessage = 'OTP sent if phone number is valid';

    // If user doesn't exist, create new user
    if (!user) {
      user = await User.create({
        name: 'User',
        phoneNumber,
        plan: 'free',
        // Email and password not required for phone users
      });
    }

    // Generate 6-digit OTP
    const otp = generateOtp();

    // Hash OTP before saving to database
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Save hashed OTP and expiry (5 minutes)
    user.phoneOtpHash = hashedOtp;
    user.phoneOtpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save({ validateBeforeSave: false });

    // Send OTP via SMS
    const message = `Your DIGIVERA OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`;
    await sendSms(phoneNumber, message);

    res.status(200).json({
      success: true,
      message: securityMessage,
    });
  } catch (error) {
    console.error('Send phone OTP error:', error);
    
    // Clear OTP fields if something fails
    if (req.body.phoneNumber) {
      await User.findOneAndUpdate(
        { phoneNumber: req.body.phoneNumber },
        { 
          phoneOtpHash: null,
          phoneOtpExpires: null 
        }
      ).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: 'Error sending OTP. Please try again.',
      error: error.message,
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/phone/verify-otp
// @access  Public
const verifyPhoneOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate input
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and OTP',
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be 6 digits',
      });
    }

    // Find user with phone number
    const user = await User.findOne({ phoneNumber }).select('+phoneOtpHash');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or OTP',
      });
    }

    // Check if OTP exists
    if (!user.phoneOtpHash || !user.phoneOtpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP.',
      });
    }

    // Check if OTP expired
    if (Date.now() > user.phoneOtpExpires) {
      // Clear expired OTP
      user.phoneOtpHash = null;
      user.phoneOtpExpires = null;
      await user.save({ validateBeforeSave: false });

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.phoneOtpHash);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // OTP verified - clear OTP fields (single use)
    user.phoneOtpHash = null;
    user.phoneOtpExpires = null;
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email || null,
        plan: user.plan,
        reputationScore: user.reputationScore,
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error('Verify phone OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP. Please try again.',
      error: error.message,
    });
  }
};

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp,
};
