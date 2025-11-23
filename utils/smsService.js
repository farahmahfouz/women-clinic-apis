const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSMS(to, message) {
    try {
      await this.client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
        body: message,
      });

      console.log('SMS sent successfully');
    } catch (error) {
      console.error('SMS sending failed:', error.message);
      throw new Error('Failed to send SMS');
    }
  }

  async sendWhatsApp(to, message) {
    try {
      await this.client.messages.create({
        from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
        body: message,
      });

      console.log('WhatsApp message sent successfully');
    } catch (error) {
      console.error('WhatsApp sending failed:', error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }
}

module.exports = SMSService;
