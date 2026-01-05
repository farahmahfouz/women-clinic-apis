const Notification = require('../models/notificationModel');

class NotificationService {
  constructor() {}
  static async createNotification({ receiver, type, title, message, data }, io = null) {
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
        createdAt: notification.createdAt
      });
    }

    return notification;
  }
}

module.exports = NotificationService;