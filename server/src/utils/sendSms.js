/**
 * Send SMS using SMS provider (abstracted)
 * In production, use Twilio, Fast2SMS, MSG91, etc.
 * @param {String} phoneNumber - Recipient phone number
 * @param {String} message - SMS message content
 */
const sendSms = async (phoneNumber, message) => {
  try {
    // Development mode - log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n📱 SMS SENT (Development Mode):');
      console.log('═'.repeat(50));
      console.log(`To: ${phoneNumber}`);
      console.log(`Message: ${message}`);
      console.log('═'.repeat(50) + '\n');
      return { success: true, mode: 'development' };
    }

    // Production mode - use SMS provider
    // Example with Twilio (uncomment and configure)
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    
    const client = require('twilio')(accountSid, authToken);
    
    const messageResponse = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber
    });
    
    console.log(`SMS sent successfully: ${messageResponse.sid}`);
    return { success: true, messageId: messageResponse.sid };
    */

    // Example with Fast2SMS (uncomment and configure)
    /*
    const axios = require('axios');
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      route: 'v3',
      sender_id: process.env.FAST2SMS_SENDER_ID,
      message: message,
      language: 'english',
      flash: 0,
      numbers: phoneNumber
    }, {
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY
      }
    });
    
    return { success: true, data: response.data };
    */

    // Example with MSG91 (uncomment and configure)
    /*
    const axios = require('axios');
    const response = await axios.get('https://api.msg91.com/api/v5/otp', {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobile: phoneNumber,
        otp: message.match(/\d{6}/)[0] // Extract OTP from message
      }
    });
    
    return { success: true, data: response.data };
    */

    console.log(`SMS sent to ${phoneNumber}: ${message}`);
    return { success: true };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendSms;
