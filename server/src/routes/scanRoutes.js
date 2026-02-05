const express = require('express');
const { runScan, getLatestScan } = require('../controllers/scanController');
const { getScanHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/scan
router.post('/', protect, runScan);

// GET /api/scan/latest
router.get('/latest', protect, getLatestScan);

// GET /api/scan/history
router.get('/history', protect, getScanHistory);

module.exports = router;
