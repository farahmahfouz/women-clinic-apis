const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const Email = require('../utils/email');
const SMSService = require('../utils/smsService');

const CRITICAL_TYPES_FOR_EMAIL = ['booking_confirmed', 'booking_cancelled', 'booking_reminder'];
const CRITICAL_TYPES_FOR_SMS = ['booking_confirmed', 'booking_cancelled', 'booking_reminder'];

const smsService = new SMSService();

class NotificationService {
  /**
   * Create in-app notification and optionally send email/SMS for critical types.
   * @param {Object} params - receiver (userId), type, title, message, data
   * @param {Object} io - Socket.io instance for real-time push
   * @param {Object} options - { channels: ['in_app','email','sms'] } default ['in_app']
   */
  static async createNotification(
    { receiver, type, title, message, data },
    io = null,
    options = {}
  ) {
    const channels = options.channels || ['in_app'];
    const notification = await Notification.create({
      receiver,
      type,
      title,
      message,
      data,
    });

    if (io) {
      io.to(`user-${receiver}`).emit('new-notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: notification.read,
        createdAt: notification.createdAt,
      });
    }

    if (
      channels.includes('email') &&
      CRITICAL_TYPES_FOR_EMAIL.includes(type)
    ) {
      this._sendEmailToReceiver(receiver, title, message).catch((err) =>
        console.error('Notification email failed:', err?.message)
      );
    }
    if (channels.includes('sms') && CRITICAL_TYPES_FOR_SMS.includes(type)) {
      this._sendSMSToReceiver(receiver, message).catch((err) =>
        console.error('Notification SMS failed:', err?.message)
      );
    }

    return notification;
  }

  static async _sendEmailToReceiver(receiverId, title, message) {
    const user = await User.findById(receiverId).select('email').lean();
    if (!user?.email) return;
    await Email.sendNotificationEmail(user.email, title, title, message);
  }

  static async _sendSMSToReceiver(receiverId, message) {
    const user = await User.findById(receiverId).select('phone').lean();
    if (!user?.phone) return;
    await smsService.sendSMS(user.phone, message);
  }
}

module.exports = NotificationService;