const Scan = require('../models/Scan');

// @desc    Get scan history for logged-in user
// @route   GET /api/scan/history
// @access  Private
const getScanHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch scans for the user (latest first)
    const scans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count
    const totalScans = await Scan.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: 'Scan history retrieved successfully',
      data: {
        scans,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalScans / limit),
          totalScans,
          scansPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving scan history',
      error: error.message,
    });
  }
};

module.exports = {
  getScanHistory,
};
