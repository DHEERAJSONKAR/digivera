const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const User = require('../models/User');
const { calculateRiskScore } = require('../services/riskCalculator');
const githubExposureService = require('../services/githubExposureService');

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

    // Initialize findings object
    const findings = {
      publicExposure: 0,
      publicMentions: 0,
    };

    let githubExposureCount = 0;
    let scanLimitedData = false;

    // Check for public GitHub exposure (email scans only)
    if (scanTarget === 'email') {
      try {
        const githubResult = await githubExposureService.checkEmailExposure(targetValue);
        
        if (githubResult.error) {
          // GitHub service had issues, but scan continues
          scanLimitedData = true;
          console.warn('[Scan] GitHub check unavailable:', githubResult.error);
        } else if (githubResult.found) {
          // Email found in public GitHub code
          githubExposureCount = githubResult.count;
          findings.publicExposure = githubExposureCount;
        }
      } catch (error) {
        console.error('[Scan] GitHub exposure check failed:', error.message);
        scanLimitedData = true;
      }
    }

    // Calculate risk score based on findings
    const { finalScore, severity, explanation } = calculateRiskScore(findings);

    // Get previous scan for comparison (alert logic)
    const previousScan = await Scan.findOne({ userId, scanTarget, targetValue })
      .sort({ createdAt: -1 })
      .select('findings');

    // Save new scan to database
    const scan = await Scan.create({
      userId,
      scanTarget,
      targetValue,
      findings,
      riskScore: finalScore,
    });

    // Create alert ONLY if NEW public exposure detected
    if (githubExposureCount > 0) {
      const previousExposure = previousScan?.findings?.publicExposure || 0;
      
      // Alert only if this is a new exposure or exposure count increased
      if (previousExposure === 0 || githubExposureCount > previousExposure) {
        const alertSeverity = githubExposureCount >= 5 ? 'high' : 'medium';
        const alertMessage = githubExposureCount >= 5
          ? `Critical: Your email "${targetValue}" was found in ${githubExposureCount} publicly accessible code repositories. Immediate action required!`
          : `Warning: Your email "${targetValue}" was found in publicly accessible developer resources. Review recommended.`;

        await Alert.create({
          userId,
          type: 'public_exposure',
          severity: alertSeverity,
          message: alertMessage,
        });
      }
    }

    // Update user's reputation score and last manual scan time
    await User.findByIdAndUpdate(userId, {
      reputationScore: finalScore,
      lastManualScanAt: new Date(),
    });

    // Build response message
    const responseMessage = scanLimitedData
      ? 'Scan completed with limited public data availability'
      : 'Scan completed successfully';

    // Return scan result (privacy-safe)
    res.status(200).json({
      success: true,
      message: responseMessage,
      data: {
        scanId: scan._id,
        scanTarget,
        targetValue,
        findings: {
          publicExposure: findings.publicExposure,
          publicMentions: findings.publicMentions,
        },
        riskScore: finalScore,
        severity,
        explanation,
        scannedAt: scan.createdAt,
      },
    });
  } catch (error) {
    console.error('Scan error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    res.status(500).json({
      success: false,
      message: 'Server error during scan',
      error: error.message,
    });
  }
};

// @desc    Get latest scan for logged-in user
// @route   GET /api/scan/latest
// @access  Private
const getLatestScan = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the most recent scan for the user
    const latestScan = await Scan.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    if (!latestScan) {
      return res.status(404).json({
        success: false,
        message: 'No scans found',
      });
    }

    // Format response to match frontend expectations
    const response = {
      success: true,
      data: {
        _id: latestScan._id,
        target: latestScan.targetValue,
        targetType: latestScan.scanTarget,
        breachCount: latestScan.findings?.breachCount || 0,
        publicMentions: latestScan.findings?.publicMentions || 0,
        exposedAccounts: latestScan.findings?.exposedAccounts || 0,
        riskScore: latestScan.riskScore || 0,
        createdAt: latestScan.createdAt,
      },
    };

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get latest scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving latest scan',
      error: error.message,
    });
  }
};

module.exports = {
  runScan,
  getLatestScan,
};
