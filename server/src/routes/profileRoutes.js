const express = require('express');
const { getProfile, updateProfile, deleteProfile, uploadProfilePhoto, deleteProfilePhoto } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// GET /api/me - Get user profile
router.get('/', getProfile);

// PUT /api/me - Update user profile
router.put('/', updateProfile);

// DELETE /api/me - Delete user profile
router.delete('/', deleteProfile);

// POST /api/me/photo - Upload profile photo
router.post('/photo', upload.single('photo'), uploadProfilePhoto);

// DELETE /api/me/photo - Delete profile photo
router.delete('/photo', deleteProfilePhoto);

module.exports = router;
