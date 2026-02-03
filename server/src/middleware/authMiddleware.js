const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from header
    token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      throw new ApiError(401, 'User not found', 'USER_NOT_FOUND');
    }

    return next();
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided', 'UNAUTHORIZED');
  }
});

module.exports = { protect };
