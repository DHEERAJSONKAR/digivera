const cron = require('node-cron');
const User = require('../models/User');
const Scan = require('../models/Scan');
const Alert = require('../models/Alert');
const { calculateRiskScore } = require('./riskCalculator');
const sendEmail = require('../utils/sendEmail');

/**
 * Weekly auto scan for PRO users
 * Runs every Monday at 9:00 AM
 */
const startWeeklyAutoScan = () => {
  // Schedule: Every Monday at 9:00 AM
  // Cron format: minute hour day-of-month month day-of-week
  // '0 9 * * 1' = At 9:00 AM every Monday
  cron.schedule('0 9 * * 1', async () => {
    console.log('Running weekly auto scan for PRO users...');

    try {
      // Fetch all PRO users
      const proUsers = await User.find({ plan: 'pro' });

      if (proUsers.length === 0) {
        console.log('No PRO users found for auto scan');
        return;
      }

      console.log(`Found ${proUsers.length} PRO users for auto scan`);

      // Process each user
      for (const user of proUsers) {
        try {
          // Get user's last scan
          const lastScan = await Scan.findOne({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(1);

          if (!lastScan) {
            console.log(`No previous scan found for user ${user.email}`);
            continue;
          }

          // Simulate new findings
          const breachCount = Math.floor(Math.random() * 4); // 0-3
          const publicMentions = Math.floor(Math.random() * 6); // 0-5

          const findings = {
            breachCount,
            publicMentions,
          };

          // Calculate risk score
          const { finalScore, severity } = calculateRiskScore(findings);

          // Save new scan
          const newScan = await Scan.create({
            userId: user._id,
            scanTarget: lastScan.scanTarget,
            targetValue: lastScan.targetValue,
            findings,
            riskScore: finalScore,
          });

          console.log(
            `Auto scan completed for ${user.email} - Score: ${finalScore}, Severity: ${severity}`
          );

          // Create alert and send email if severity is medium or high
          if (severity === 'medium' || severity === 'high') {
            const alertType = breachCount > 0 ? 'breach' : 'exposure';
            const alertMessage =
              severity === 'high'
                ? `Critical: Your ${lastScan.scanTarget} "${lastScan.targetValue}" has ${breachCount} breach(es) and ${publicMentions} public mention(s). Immediate action required!`
                : `Warning: Your ${lastScan.scanTarget} "${lastScan.targetValue}" has ${breachCount} breach(es) and ${publicMentions} public mention(s). Review recommended.`;

            // Create alert
            await Alert.create({
              userId: user._id,
              type: alertType,
              severity,
              message: alertMessage,
            });

            // Send email notification
            const emailSubject =
              severity === 'high'
                ? '🚨 DIGIVERA: Critical Security Alert'
                : '⚠️ DIGIVERA: Security Warning';

            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: ${severity === 'high' ? '#dc3545' : '#ffc107'};">
                  ${severity === 'high' ? 'Critical Alert' : 'Security Warning'}
                </h2>
                <p>Hi ${user.name},</p>
                <p>${alertMessage}</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3>Scan Results:</h3>
                  <ul>
                    <li><strong>Target:</strong> ${lastScan.targetValue}</li>
                    <li><strong>Breach Count:</strong> ${breachCount}</li>
                    <li><strong>Public Mentions:</strong> ${publicMentions}</li>
                    <li><strong>Risk Score:</strong> ${finalScore}/100</li>
                    <li><strong>Severity:</strong> ${severity.toUpperCase()}</li>
                  </ul>
                </div>
                <p>Login to your DIGIVERA dashboard to view detailed report.</p>
                <p style="color: #6c757d; font-size: 12px; margin-top: 30px;">
                  This is an automated weekly scan for PRO users.
                </p>
              </div>
            `;

            await sendEmail(user.email, emailSubject, emailHtml);
          }

          // Update user's reputation score
          await User.findByIdAndUpdate(user._id, {
            reputationScore: finalScore,
          });
        } catch (userError) {
          console.error(
            `Error processing auto scan for user ${user.email}:`,
            userError.message
          );
          // Continue with next user
        }
      }

      console.log('Weekly auto scan completed');
    } catch (error) {
      console.error('Weekly auto scan failed:', error.message);
    }
  });

  console.log('Weekly auto scan cron job started (runs every Monday at 9:00 AM)');
};

module.exports = { startWeeklyAutoScan };
