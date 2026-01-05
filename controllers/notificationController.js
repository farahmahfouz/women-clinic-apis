const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ 
    receiver: req.user.id 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: { notifications }
  });
});

exports.markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, receiver: req.user.id },
    { read: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) throw new AppError('Notification not found', 404);
  
  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read',
    data: { notification }
  });
});