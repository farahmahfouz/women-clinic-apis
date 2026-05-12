const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMyNotifications = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const unreadOnly = req.query.unread === 'true';

  const query = { receiver: req.user.id };
  if (unreadOnly) query.read = false;

  const [notifications, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: { notifications },
  });
});

exports.getUnreadCount = catchAsync(async (req, res) => {
  const count = await Notification.countDocuments({
    receiver: req.user.id,
    read: false,
  });

  res.status(200).json({
    status: 'success',
    data: { unreadCount: count },
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
    data: { notification },
  });
});

exports.markAllAsRead = catchAsync(async (req, res) => {
  const result = await Notification.updateMany(
    { receiver: req.user.id, read: false },
    { read: true, readAt: new Date() }
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
    data: { modifiedCount: result.modifiedCount },
  });
});