const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const User = require('../models/User');
const { calculateRiskScore } = require('../services/riskCalculator');

// @desc    Run a new scan
// @route   POST /api/scan
// @access  Private
const runScan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { scanTarget, targetValue } = req.body;

    // Validate input
    if (!scanTarget || !targetValue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide scanTarget and targetValue',
      });
    }

    // Validate scanTarget
    if (!['email', 'name'].includes(scanTarget)) {
      return res.status(400).json({
        success: false,
        message: 'scanTarget must be either "email" or "name"',
      });
    }

    // Check subscription limits for Free users
    const user = await User.findById(userId);
    
    if (user.plan === 'free') {
      // Check if user has already scanned this month
      if (user.lastManualScanAt) {
        const lastScanDate = new Date(user.lastManualScanAt);
        const currentDate = new Date();
        
        // Check if last scan was in the current month
        const isSameMonth =
          lastScanDate.getMonth() === currentDate.getMonth() &&
          lastScanDate.getFullYear() === currentDate.getFullYear();
        
        if (isSameMonth) {
          return res.status(403).json({
            success: false,
            message: 'Free plan allows only 1 scan per month. Upgrade to Pro for unlimited scans.',
            limit: {
              plan: 'free',
              scansPerMonth: 1,
              nextScanAvailable: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
              ),
            },
          });
        }
      }
    }

    // Simulate scan with random data
    const breachCount = Math.floor(Math.random() * 4); // 0-3
    const publicMentions = Math.floor(Math.random() * 6); // 0-5

    const findings = {
      breachCount,
      publicMentions,
    };

    // Calculate risk score
    const { finalScore, severity } = calculateRiskScore(findings);

    // Save scan to database
    const scan = await Scan.create({
      userId,
      scanTarget,
      targetValue,
      findings,
      riskScore: finalScore,
    });

    // Create alert if severity is medium or high
    if (severity === 'medium' || severity === 'high') {
      const alertType = breachCount > 0 ? 'breach' : 'exposure';
      const alertMessage =
        severity === 'high'
          ? `Critical: Your ${scanTarget} "${targetValue}" has ${breachCount} breach(es) and ${publicMentions} public mention(s). Immediate action required!`
          : `Warning: Your ${scanTarget} "${targetValue}" has ${breachCount} breach(es) and ${publicMentions} public mention(s). Review recommended.`;

      await Alert.create({
        userId,
        type: alertType,
        severity,
        message: alertMessage,
      });
    }

    // Update user's reputation score and last manual scan time
    await User.findByIdAndUpdate(userId, {
      reputationScore: finalScore,
      lastManualScanAt: new Date(),
    });

    // Return scan result
    res.status(200).json({
      success: true,
      message: 'Scan completed successfully',
      data: {
        scanId: scan._id,
        scanTarget,
        targetValue,
        findings: {
          breachCount,
          publicMentions,
        },
        riskScore: finalScore,
        severity,
        scannedAt: scan.createdAt,
      },
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during scan',
      error: error.message,
    });
  }
};

module.exports = {
  runScan,
};
