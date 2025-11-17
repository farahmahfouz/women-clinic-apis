const serviceService = require('../services/serviceService');
const catchAsync = require('../utils/catchAsync');

exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await serviceService.getAllServices();

  res.status(200).json({
    status: 'success',
    results: services.length,
    message: 'Services retrieved successfully',
    data: { services },
  });
});


exports.getService = catchAsync(async (req, res, next) => {
  const service = await serviceService.getOneService(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Service retrieved successfully',
    data: { service },
  });
});

exports.createService = catchAsync(async (req, res, next) => {
  const service = await serviceService.createService(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Services created successfully',
    data: { service },
  });
});

exports.updateService = catchAsync(async (req, res, next) => {
  const updatedService = await serviceService.updateService(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    message: 'Services updated successfully',
    data: { service: updatedService },
  });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  await serviceService.deleteService(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Services deleted successfully',
    data: null,
  });
});
