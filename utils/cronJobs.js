const cron = require('node-cron');
const Booking = require('../models/bookingModel');
const SMSService = require('./smsService');

const whatsappService = new SMSService();

cron.schedule('* 9 * * *', async () => {
  console.log('running a task every minute');
  await notifiyAboutServiceSession();
});

const notifiyAboutServiceSession = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
  const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

  const bookings = await Booking.find({
    dateOfService: { $gte: startOfDay, $lte: endOfDay },
    status: 'confirmed',
  });

  for (const booking of bookings) {
    await whatsappService.sendWhatsApp(
      booking.user.phone,
      `Reminder: You have a session tomorrow at ${booking.timeSlot.start}.`
    );
  }
};

module.exports = {
  notifiyAboutServiceSession,
};
