const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./src/models/User');
const Scan = require('./src/models/Scan');
const Alert = require('./src/models/Alert');
const Subscription = require('./src/models/Subscription');

async function testProfileAPIs() {
  try {
    console.log('\n👤 Testing User Profile APIs\n');
    console.log('=' .repeat(60));

    // Get sample user
    const user = await User.findOne();
    
    if (!user) {
      console.log('\n⚠️  No users found. Create a user first using register API.');
      process.exit(0);
    }

    console.log('\n📊 Sample User:');
    console.log('-'.repeat(60));
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email || 'N/A'}`);
    console.log(`Phone: ${user.phoneNumber || 'N/A'}`);
    console.log(`Plan: ${user.plan.toUpperCase()}`);
    console.log(`Reputation Score: ${user.reputationScore}/100`);
    console.log(`Created: ${user.createdAt}`);

    // Count related data
    const scanCount = await Scan.countDocuments({ userId: user._id });
    const alertCount = await Alert.countDocuments({ userId: user._id });
    const subCount = await Subscription.countDocuments({ userId: user._id });

    console.log('\n📦 Related Data:');
    console.log('-'.repeat(60));
    console.log(`Scans: ${scanCount}`);
    console.log(`Alerts: ${alertCount}`);
    console.log(`Subscriptions: ${subCount}`);

    console.log('\n' + '='.repeat(60));
    console.log('\n🧪 Test Profile APIs:\n');

    console.log('1️⃣  Get Profile:');
    console.log('   GET /api/me');
    console.log('   Headers: { Authorization: Bearer YOUR_JWT_TOKEN }\n');

    console.log('2️⃣  Update Profile:');
    console.log('   PUT /api/me');
    console.log('   Headers: { Authorization: Bearer YOUR_JWT_TOKEN }');
    console.log('   Body: {');
    console.log('     "name": "John Doe",');
    console.log('     "email": "john@example.com",');
    console.log('     "phoneNumber": "+1234567890"');
    console.log('   }\n');

    console.log('3️⃣  Delete Profile (⚠️  PERMANENT):');
    console.log('   DELETE /api/me');
    console.log('   Headers: { Authorization: Bearer YOUR_JWT_TOKEN }');
    console.log('   ⚠️  This will delete:');
    console.log('      • User account');
    console.log('      • All scans');
    console.log('      • All alerts');
    console.log('      • All subscriptions\n');

    console.log('=' .repeat(60));
    console.log('\n✨ Features:');
    console.log('   • JWT authentication required');
    console.log('   • Get current user profile');
    console.log('   • Update name, email, phone');
    console.log('   • Cannot update plan or reputationScore');
    console.log('   • Cascading delete of all related data');
    console.log('   • Duplicate email/phone validation');
    console.log('   • Proper error handling\n');

    console.log('📝 cURL Examples:\n');
    
    console.log('# Get Profile');
    console.log('curl -X GET http://localhost:5000/api/me \\');
    console.log('  -H "Authorization: Bearer YOUR_TOKEN"\n');
    
    console.log('# Update Profile');
    console.log('curl -X PUT http://localhost:5000/api/me \\');
    console.log('  -H "Authorization: Bearer YOUR_TOKEN" \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"name": "John Doe", "email": "john@example.com"}\'\n');
    
    console.log('# Delete Profile');
    console.log('curl -X DELETE http://localhost:5000/api/me \\');
    console.log('  -H "Authorization: Bearer YOUR_TOKEN"\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testProfileAPIs();
