const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./src/models/User');

async function testPasswordReset() {
  try {
    console.log('\n🔐 Testing Password Reset Setup\n');
    console.log('=' .repeat(60));

    // Check if users exist
    const users = await User.find().select('name email resetPasswordToken resetPasswordExpires');
    
    console.log('\n👥 Users in Database:');
    console.log('-'.repeat(60));
    
    if (users.length === 0) {
      console.log('❌ No users found. Register a user first.');
      process.exit(1);
    }

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name} (${user.email})`);
      if (user.resetPasswordToken) {
        console.log(`   🔑 Reset Token: ${user.resetPasswordToken.substring(0, 20)}...`);
        console.log(`   ⏰ Expires: ${user.resetPasswordExpires}`);
        
        const isExpired = new Date(user.resetPasswordExpires) < new Date();
        console.log(`   Status: ${isExpired ? '❌ Expired' : '✅ Valid'}`);
      } else {
        console.log(`   🔓 No active reset token`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n🧪 Test Password Reset Flow:\n');
    console.log('1. Request reset link:');
    console.log('   POST /api/auth/forgot-password');
    console.log('   Body: { "email": "john@example.com" }\n');
    
    console.log('2. Check email for reset link\n');
    
    console.log('3. Reset password:');
    console.log('   POST /api/auth/reset-password/<token>');
    console.log('   Body: { "newPassword": "newPassword123" }\n');
    
    console.log('4. Login with new password:');
    console.log('   POST /api/auth/login');
    console.log('   Body: { "email": "john@example.com", "password": "newPassword123" }\n');

    console.log('📚 See PASSWORD_RESET_GUIDE.md for detailed documentation\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPasswordReset();
