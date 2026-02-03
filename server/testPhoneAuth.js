const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./src/models/User');

async function testPhoneAuth() {
  try {
    console.log('\n📱 Testing Phone OTP Authentication\n');
    console.log('=' .repeat(60));

    // Check users with phone numbers
    const allUsers = await User.find().select('name email phoneNumber phoneOtpExpires');
    const phoneUsers = await User.find({ phoneNumber: { $ne: null } }).select('name phoneNumber phoneOtpExpires');
    
    console.log('\n👥 Users:');
    console.log('-'.repeat(60));
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Phone Users: ${phoneUsers.length}`);
    console.log(`Email Users: ${allUsers.length - phoneUsers.length}`);
    
    if (phoneUsers.length > 0) {
      console.log('\n📋 Phone-based Accounts:');
      phoneUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Phone: ${user.phoneNumber}`);
        if (user.phoneOtpExpires) {
          const isExpired = new Date(user.phoneOtpExpires) < new Date();
          console.log(`   OTP Status: ${isExpired ? '❌ Expired' : '✅ Valid'}`);
          console.log(`   Expires: ${user.phoneOtpExpires}`);
        } else {
          console.log(`   🔓 No active OTP`);
        }
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🧪 Test Phone OTP Flow:\n');
    console.log('1. Send OTP:');
    console.log('   POST /api/auth/phone/send-otp');
    console.log('   Body: { "phoneNumber": "+1234567890" }\n');
    
    console.log('2. Check console for OTP (development mode)\n');
    
    console.log('3. Verify OTP:');
    console.log('   POST /api/auth/phone/verify-otp');
    console.log('   Body: { "phoneNumber": "+1234567890", "otp": "123456" }\n');
    
    console.log('4. Receive JWT token and login\n');

    console.log('✨ Features:');
    console.log('   • Passwordless authentication');
    console.log('   • Auto-creates users if they don\'t exist');
    console.log('   • 6-digit numeric OTP');
    console.log('   • OTP expires in 5 minutes');
    console.log('   • Single-use OTP (cleared after verification)');
    console.log('   • Rate limit: 3 OTP requests per hour');
    console.log('   • Secure bcrypt hashing in database');
    console.log('   • SMS provider abstracted (logs in dev mode)\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPhoneAuth();
