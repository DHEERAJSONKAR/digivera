const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Alert = require('./src/models/Alert');
const User = require('./src/models/User');

async function checkAlerts() {
  try {
    // Get all users
    const users = await User.find().select('name email');
    console.log('\n📋 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    // Get all alerts
    const alerts = await Alert.find().populate('userId', 'name email');
    console.log(`\n🔔 Total Alerts in database: ${alerts.length}`);
    
    if (alerts.length > 0) {
      alerts.forEach((alert, index) => {
        console.log(`\nAlert ${index + 1}:`);
        console.log(`  User: ${alert.userId?.name} (${alert.userId?.email})`);
        console.log(`  Type: ${alert.type}`);
        console.log(`  Severity: ${alert.severity}`);
        console.log(`  Message: ${alert.message}`);
        console.log(`  Read: ${alert.isRead}`);
        console.log(`  Created: ${alert.createdAt}`);
      });
    } else {
      console.log('\n❌ No alerts found. Run a scan with medium/high severity to create alerts.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAlerts();
