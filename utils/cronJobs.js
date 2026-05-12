const cron = require('node-cron');
const Booking = require('../models/bookingModel');
const SMSService = require('./smsService');
const NotificationService = require('../services/notificationService');

const whatsappService = new SMSService();

cron.schedule('0 9 * * *', async () => {
  await notifiyAboutServiceSession();
});

const notifiyAboutServiceSession = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfDay = new Date(tomorrow);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(tomorrow);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    dateOfService: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['confirmed', 'pending'] },
  });

  for (const booking of bookings) {
    const receiverId = booking.user?._id || booking.user;
    const phone = booking.user?.phone;
    const message = `Reminder: You have a session tomorrow at ${booking.timeSlot?.start || 'the scheduled time'}.`;

    if (receiverId) {
      await NotificationService.createNotification(
        {
          receiver: receiverId,
          type: 'booking_reminder',
          title: 'موعد غداً',
          message,
          data: { bookingId: booking._id },
        },
        null,
        { channels: ['in_app', 'email'] }
      ).catch((err) => console.error('Reminder notification failed:', err?.message));
    }

    if (phone) {
      whatsappService.sendWhatsApp(phone, message).catch((err) =>
        console.error('Reminder WhatsApp failed:', err?.message)
      );
    }
  }
};

module.exports = {
  notifiyAboutServiceSession,
};
