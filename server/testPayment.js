const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./src/models/User');
const Subscription = require('./src/models/Subscription');

async function testPaymentSetup() {
  try {
    console.log('\n💳 Testing Payment Integration Setup\n');
    console.log('=' .repeat(60));

    // Check environment variables
    console.log('\n📋 Environment Variables:');
    console.log('-'.repeat(60));
    console.log(`RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set (optional for testing)' : '⚠️  Not set (needed for webhooks)'}`);

    // Check users
    const users = await User.find().select('name email plan');
    console.log('\n👥 Users:');
    console.log('-'.repeat(60));
    users.forEach(user => {
      console.log(`  ${user.name} (${user.email}) - Plan: ${user.plan.toUpperCase()}`);
    });

    // Check subscriptions
    const subscriptions = await Subscription.find().populate('userId', 'name email');
    console.log(`\n💰 Active Subscriptions: ${subscriptions.length}`);
    console.log('-'.repeat(60));
    
    if (subscriptions.length > 0) {
      subscriptions.forEach((sub, index) => {
        console.log(`\nSubscription ${index + 1}:`);
        console.log(`  User: ${sub.userId?.name} (${sub.userId?.email})`);
        console.log(`  Provider: ${sub.provider.toUpperCase()}`);
        console.log(`  Status: ${sub.status}`);
        console.log(`  Amount: ${sub.currency} ${sub.amount}`);
        console.log(`  Valid: ${sub.startedAt.toDateString()} → ${sub.endsAt.toDateString()}`);
      });
    } else {
      console.log('  No subscriptions yet. Test payment flow to create one.');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🧪 Test Payment Flow:');
    console.log('\n  For India (Razorpay):');
    console.log('    POST /api/subscribe { "country": "india" }');
    console.log('\n  For Global (Stripe):');
    console.log('    POST /api/subscribe { "country": "global" }');
    console.log('\n  Check subscription status:');
    console.log('    GET /api/subscribe/status');
    console.log('\n💡 See PAYMENT_INTEGRATION.md for detailed testing guide\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPaymentSetup();
