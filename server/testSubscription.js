const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./src/models/User');
const Scan = require('./src/models/Scan');

async function testSubscriptionLimits() {
  try {
    console.log('\n🧪 Testing Subscription Limits\n');
    console.log('=' .repeat(60));

    // Get all users
    const users = await User.find().select('name email plan lastManualScanAt');
    
    console.log('\n📋 Current Users:');
    console.log('-'.repeat(60));
    
    for (const user of users) {
      const scanCount = await Scan.countDocuments({ userId: user._id });
      console.log(`\n👤 ${user.name} (${user.email})`);
      console.log(`   Plan: ${user.plan.toUpperCase()}`);
      console.log(`   Total Scans: ${scanCount}`);
      console.log(`   Last Manual Scan: ${user.lastManualScanAt || 'Never'}`);
      
      // Check if can scan
      if (user.plan === 'free' && user.lastManualScanAt) {
        const lastScanDate = new Date(user.lastManualScanAt);
        const currentDate = new Date();
        const isSameMonth =
          lastScanDate.getMonth() === currentDate.getMonth() &&
          lastScanDate.getFullYear() === currentDate.getFullYear();
        
        if (isSameMonth) {
          const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
          console.log(`   ❌ LIMIT REACHED - Next scan: ${nextMonth.toDateString()}`);
        } else {
          console.log(`   ✅ Can scan this month`);
        }
      } else if (user.plan === 'free') {
        console.log(`   ✅ Can scan (first scan of the month)`);
      } else {
        console.log(`   ✅ Unlimited scans (Pro user)`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Tips:');
    console.log('  - Free users: 1 scan per month');
    console.log('  - Pro users: Unlimited scans + weekly auto scan');
    console.log('  - Weekly auto scan runs every Monday at 9:00 AM (Pro only)');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSubscriptionLimits();
