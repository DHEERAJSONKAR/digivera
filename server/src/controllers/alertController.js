const Alert = require('../models/Alert');

// @desc    Get all alerts for logged-in user
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get filter parameters
    const isRead = req.query.isRead;
    const severity = req.query.severity;

    // Build query
    const query = { userId };
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    if (severity) {
      query.severity = severity;
    }

    // Fetch alerts (latest first)
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    // Count unread alerts
    const unreadCount = await Alert.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      message: 'Alerts retrieved successfully',
      data: {
        alerts,
        totalAlerts: alerts.length,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving alerts',
      error: error.message,
    });
  }
};

// @desc    Mark alert as read
// @route   PATCH /api/alerts/:id/read
// @access  Private
const markAlertAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const alertId = req.params.id;

    // Find alert
    const alert = await Alert.findOne({ _id: alertId, userId });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Check if already read
    if (alert.isRead) {
      return res.status(200).json({
        success: true,
        message: 'Alert is already marked as read',
        data: alert,
      });
    }

    // Mark as read
    alert.isRead = true;
    await alert.save();

    res.status(200).json({
      success: true,
      message: 'Alert marked as read',
      data: alert,
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking alert as read',
      error: error.message,
    });
  }
};

module.exports = {
  getAlerts,
  markAlertAsRead,
};
