const ReviewService = require('../services/reviewService');
const catchAsync = require('../utils/catchAsync');
const ServiceOption = require('../models/serviceOptionModel');
const SubService = require('../models/subServiceModel');
const AppError = require('../utils/appError');

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
  console.log('FINAL BODY BEFORE CREATE:', req.body);

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

exports.resolveServiceFromOption = async (req, res, next) => {
  console.log('INCOMING BODY:', req.body);

  if (req.body.service) return next();

  if (!req.body.serviceOption) {
    return next(new AppError('ServiceOption is required', 400));
  }

  // 1. get option
  const option = await ServiceOption.findById(req.body.serviceOption);
  console.log(option)
  if (!option) {
    return next(new AppError('ServiceOption not found', 404));
  }

  // 2. get subService
  const subService = await SubService.findById(option.subService);
  console.log(subService)
  if (!subService) {
    return next(new AppError('SubService not found', 404));
  }

  // 3. set service
  req.body.service = subService.service;
  console.log('RESOLVED SERVICE:', req.body.service);

  next();
};
