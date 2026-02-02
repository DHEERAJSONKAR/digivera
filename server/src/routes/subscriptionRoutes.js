const express = require('express');
const {
  createSubscription,
  verifyPayment,
  handleStripeWebhook,
  getSubscriptionStatus,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/subscribe - Create payment session
router.post('/', protect, createSubscription);

// POST /api/subscribe/verify - Verify Razorpay payment
router.post('/verify', protect, verifyPayment);

// POST /api/subscribe/webhook - Stripe webhook (no auth - Stripe verifies)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// GET /api/subscribe/status - Get subscription status
router.get('/status', protect, getSubscriptionStatus);

module.exports = router;
