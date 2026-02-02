const nodemailer = require('nodemailer');

/**
 * Send email using Nodemailer
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} html - HTML content
 */
const sendEmail = async (to, subject, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"DIGIVERA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // Don't throw error - let the app continue
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
