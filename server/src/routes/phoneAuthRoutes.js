const express = require('express');
const { sendPhoneOtp, verifyPhoneOtp } = require('../controllers/phoneAuthController');

const router = express.Router();

// POST /api/auth/phone/send-otp
router.post('/send-otp', sendPhoneOtp);

// POST /api/auth/phone/verify-otp
router.post('/verify-otp', verifyPhoneOtp);

module.exports = router;
