/**
 * Global Error Handler Middleware
 * Catches all errors and returns standardized response
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.code || 'INTERNAL_ERROR';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    errorCode = 'DUPLICATE_ERROR';
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Log error for debugging (in development)
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', {
      message: err.message,
      code: errorCode,
      stack: err.stack,
    });
  }

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    message,
    code: errorCode,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
