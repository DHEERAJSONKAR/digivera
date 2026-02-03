const express = require('express');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// GET /api/me - Get user profile
router.get('/', getProfile);

// PUT /api/me - Update user profile
router.put('/', updateProfile);

// DELETE /api/me - Delete user profile
router.delete('/', deleteProfile);

module.exports = router;
