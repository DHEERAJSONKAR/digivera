const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./src/models/User');

async function testGoogleLogin() {
  try {
    console.log('\n🔐 Testing Google Login Setup\n');
    console.log('=' .repeat(60));

    // Check environment variables
    console.log('\n📋 Environment Variables:');
    console.log('-'.repeat(60));
    console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
    
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id.apps.googleusercontent.com') {
      console.log('\n⚠️  Warning: Set real GOOGLE_CLIENT_ID in .env');
      console.log('   Get it from: https://console.cloud.google.com/');
    }

    // Check users
    const allUsers = await User.find().select('name email googleId');
    const googleUsers = await User.find({ googleId: { $ne: null } }).select('name email googleId');
    
    console.log('\n👥 Users:');
    console.log('-'.repeat(60));
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Google Users: ${googleUsers.length}`);
    console.log(`Email/Password Users: ${allUsers.length - googleUsers.length}`);
    
    if (googleUsers.length > 0) {
      console.log('\n📋 Google Connected Accounts:');
      googleUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Google ID: ${user.googleId.substring(0, 20)}...`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🧪 Test Google Login:\n');
    console.log('Frontend Integration Required:');
    console.log('  1. Install: npm install @react-oauth/google');
    console.log('  2. Wrap app with GoogleOAuthProvider');
    console.log('  3. Use GoogleLogin component');
    console.log('  4. Send idToken to: POST /api/auth/google\n');
    
    console.log('Backend Endpoint:');
    console.log('  POST /api/auth/google');
    console.log('  Body: { "idToken": "google_id_token_here" }\n');
    
    console.log('📚 See GOOGLE_LOGIN_GUIDE.md for complete setup\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testGoogleLogin();
