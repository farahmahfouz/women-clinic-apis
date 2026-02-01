const SubService = require('../models/subServiceModel');
const subServiceService = require('../services/subServiceService');
const catchAsync = require('../utils/catchAsync');

exports.getAllSubServices = catchAsync(async (req, res, next) => {
  const subServices = await subServiceService.getAllSubServices(req.query);

  res.status(200).json({
    status: 'success',
    results: subServices.length,
    data: {
      subServices,
    },
  });
});

// GET /api/v1/sub-services/slug/:slug
exports.getSubServiceBySlug = catchAsync(async (req, res, next) => {
  const subService = await SubService.findOne({ slug: req.params.slug });

  if (!subService) {
    return next(new AppError('SubService not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { subService },
  });
});


exports.getSubService = catchAsync(async (req, res, next) => {
  const subService = await subServiceService.getSubService(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      subService,
    },
  });
});

exports.createSubService = catchAsync(async (req, res, next) => {
  const subService = await subServiceService.createSubService(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      subService,
    },
  });
});

exports.updateSubService = catchAsync(async (req, res, next) => {
  const subService = await subServiceService.updateSubService(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: {
      subService,
    },
  });
});

exports.deleteSubService = catchAsync(async (req, res, next) => {
  await subServiceService.deleteSubService(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
