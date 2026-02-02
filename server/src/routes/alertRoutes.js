const express = require('express');
const { getAlerts, markAlertAsRead } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/alerts
router.get('/', protect, getAlerts);

// PATCH /api/alerts/:id/read
router.patch('/:id/read', protect, markAlertAsRead);

module.exports = router;
