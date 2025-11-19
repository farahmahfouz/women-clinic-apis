const ReviewService = require('../services/reviewService');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.serviceId) filter = { service: req.params.serviceId };
  const reviews = await ReviewService.getAllReview(filter);

  res.status(200).json({
    status: 'success',
    message: 'Reviews retrieved successfully',
    results: reviews.length,
    data: { reviews },
  });
});

exports.getOneReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.getOneReview(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Review retrieved successfully',
    data: { review },
  });
});

exports.setServicesUserIds = (req, res, next) => {
  if (!req.body.service) req.body.service = req.params.serviceId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.createReview(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    data: { review },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.updateReview(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    data: { review },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await ReviewService.deleteReview(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Review deleted successfully',
    data: null,
  });
});
