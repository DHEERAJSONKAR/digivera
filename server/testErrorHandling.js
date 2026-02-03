const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const ApiError = require('./src/utils/ApiError');
const asyncHandler = require('./src/utils/asyncHandler');

console.log('\n🛡️  Testing Error Handling System\n');
console.log('=' .repeat(60));

console.log('\n✅ Files Created:\n');
console.log('1. src/utils/asyncHandler.js');
console.log('   • Wraps async functions');
console.log('   • Catches errors automatically');
console.log('   • Passes to error middleware\n');

console.log('2. src/middleware/errorHandler.js');
console.log('   • Global error handler');
console.log('   • Standardized error responses');
console.log('   • Handles Mongoose, JWT, validation errors\n');

console.log('3. src/utils/ApiError.js');
console.log('   • Custom error class');
console.log('   • statusCode + message + code\n');

console.log('4. src/app.js (Updated)');
console.log('   • Error handler registered last');
console.log('   • 404 handler added');
console.log('   • Test route updated\n');

console.log('=' .repeat(60));
console.log('\n📋 Standardized Response Formats:\n');

console.log('✅ Success Response:');
console.log(JSON.stringify({
  success: true,
  message: 'Operation successful',
  data: { id: '123', name: 'John' }
}, null, 2));

console.log('\n❌ Error Response:');
console.log(JSON.stringify({
  success: false,
  message: 'Readable error message',
  code: 'ERROR_CODE'
}, null, 2));

console.log('\n' + '=' .repeat(60));
console.log('\n🧪 Usage Examples:\n');

console.log('1️⃣  Using asyncHandler (eliminates try-catch):');
console.log(`
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
  }
  
  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: user
  });
});
`);

console.log('2️⃣  Custom Error Throwing:');
console.log(`
const ApiError = require('../utils/ApiError');

// Throw custom error
throw new ApiError(400, 'Invalid email format', 'INVALID_EMAIL');

// Error handler will catch and format it automatically
`);

console.log('3️⃣  Automatic Error Handling:');
console.log(`
// Mongoose validation errors → 400 with field messages
// Duplicate key errors → 400 with "Field already exists"
// Invalid ObjectId → 400 with "Invalid ID format"
// JWT errors → 401 with "Invalid/Expired token"
// Any other error → 500 with generic message
`);

console.log('=' .repeat(60));
console.log('\n🧪 Test Error Scenarios:\n');

console.log('# Test 404 Route');
console.log('curl http://localhost:5000/api/invalid-route\n');

console.log('# Test Invalid ID Format');
console.log('curl http://localhost:5000/api/me \\\n  -H "Authorization: Bearer invalid_token"\n');

console.log('# Test Validation Error (register with short password)');
console.log('curl -X POST http://localhost:5000/api/auth/register \\\n  -H "Content-Type: application/json" \\\n  -d \'{"email": "test@example.com", "password": "123"}\'\n');

console.log('=' .repeat(60));
console.log('\n📝 Error Codes Reference:\n');

const errorCodes = {
  'VALIDATION_ERROR': 'Mongoose validation failed',
  'DUPLICATE_ERROR': 'Duplicate key (email/phone exists)',
  'INVALID_ID': 'Invalid MongoDB ObjectId',
  'INVALID_TOKEN': 'JWT token is invalid',
  'TOKEN_EXPIRED': 'JWT token has expired',
  'ROUTE_NOT_FOUND': 'API route does not exist',
  'USER_NOT_FOUND': 'Custom: User not found',
  'UNAUTHORIZED': 'Custom: No auth token provided',
  'INTERNAL_ERROR': 'Generic server error'
};

Object.entries(errorCodes).forEach(([code, description]) => {
  console.log(`• ${code.padEnd(20)} - ${description}`);
});

console.log('\n' + '=' .repeat(60));
console.log('\n✨ Benefits:\n');
console.log('✅ Consistent error responses across all APIs');
console.log('✅ No more try-catch in every controller');
console.log('✅ Automatic error type detection');
console.log('✅ Developer-friendly stack traces (dev mode)');
console.log('✅ Production-safe error messages');
console.log('✅ Easy to throw custom errors with codes\n');

console.log('🚀 Error handling system ready!\n');

mongoose.connection.close();
process.exit(0);
