const Razorpay = require('razorpay');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Pricing
const PRICING = {
  india: {
    amount: 29900, // ₹299 in paise (Razorpay uses smallest currency unit)
    currency: 'INR',
    provider: 'razorpay',
  },
  global: {
    amount: 500, // $5 in cents (Stripe uses smallest currency unit)
    currency: 'USD',
    provider: 'stripe',
  },
};

// @desc    Create subscription/payment session
// @route   POST /api/subscribe
// @access  Private
const createSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Check if already Pro
    if (user.plan === 'pro') {
      return res.status(400).json({
        success: false,
        message: 'You are already a Pro user',
      });
    }

    // Detect country from header or request
    const country = req.body.country || req.headers['x-user-country'] || 'global';
    const isIndia = country.toLowerCase() === 'india' || country.toLowerCase() === 'in';

    const pricing = isIndia ? PRICING.india : PRICING.global;

    if (pricing.provider === 'razorpay') {
      // Create Razorpay order
      const options = {
        amount: pricing.amount,
        currency: pricing.currency,
        receipt: `receipt_${userId}_${Date.now()}`,
        notes: {
          userId: userId.toString(),
          plan: 'pro',
          email: user.email,
        },
      };

      const order = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        message: 'Razorpay order created',
        data: {
          provider: 'razorpay',
          orderId: order.id,
          amount: pricing.amount,
          currency: pricing.currency,
          key: process.env.RAZORPAY_KEY_ID,
          user: {
            name: user.name,
            email: user.email,
          },
        },
      });
    } else {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: pricing.currency,
              product_data: {
                name: 'DIGIVERA Pro Plan',
                description: 'Monthly subscription - Unlimited scans + Weekly auto scan',
              },
              unit_amount: pricing.amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin || 'http://localhost:3000'}/cancel`,
        client_reference_id: userId.toString(),
        customer_email: user.email,
        metadata: {
          userId: userId.toString(),
          plan: 'pro',
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Stripe checkout session created',
        data: {
          provider: 'stripe',
          sessionId: session.id,
          checkoutUrl: session.url,
          amount: pricing.amount,
          currency: pricing.currency,
        },
      });
    }
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/subscribe/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Payment verified - Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update user to Pro
    await User.findByIdAndUpdate(userId, { plan: 'pro' });

    // Calculate subscription end date (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create subscription record
    await Subscription.create({
      userId,
      provider: 'razorpay',
      providerId: razorpay_payment_id,
      status: 'active',
      amount: payment.amount / 100, // Convert paise to rupees for storage
      currency: payment.currency,
      startedAt: startDate,
      endsAt: endDate,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Welcome to Pro!',
      data: {
        plan: 'pro',
        paymentId: razorpay_payment_id,
        validUntil: endDate,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/subscribe/webhook
// @access  Public (Stripe verifies with signature)
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;

      try {
        // Update user to Pro
        await User.findByIdAndUpdate(userId, { plan: 'pro' });

        // Calculate subscription end date
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        // Create subscription record
        await Subscription.create({
          userId,
          provider: 'stripe',
          providerId: session.subscription || session.id,
          status: 'active',
          amount: session.amount_total / 100, // Convert cents to dollars
          currency: session.currency,
          startedAt: startDate,
          endsAt: endDate,
        });

        console.log(`User ${userId} upgraded to Pro via Stripe`);
      } catch (error) {
        console.error('Error processing Stripe webhook:', error);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      
      try {
        // Find and update subscription status
        await Subscription.findOneAndUpdate(
          { providerId: subscription.id },
          { status: 'cancelled' }
        );

        // Optionally downgrade user to free
        const sub = await Subscription.findOne({ providerId: subscription.id });
        if (sub) {
          await User.findByIdAndUpdate(sub.userId, { plan: 'free' });
        }

        console.log(`Subscription cancelled: ${subscription.id}`);
      } catch (error) {
        console.error('Error handling subscription cancellation:', error);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// @desc    Get user subscription details
// @route   GET /api/subscribe/status
// @access  Private
const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('plan');

    // Get active subscription
    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        plan: user.plan,
        subscription: subscription || null,
      },
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status',
      error: error.message,
    });
  }
};

module.exports = {
  createSubscription,
  verifyPayment,
  handleStripeWebhook,
  getSubscriptionStatus,
};
