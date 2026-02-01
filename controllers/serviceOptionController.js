const ServiceOptionService = require('../services/serviceOptionService');
const catchAsync = require('../utils/catchAsync');

exports.getAllServiceOptions = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.subServiceId) filter = { subService: req.params.subServiceId };
  if (req.params.slug) filter = { slug: req.params.slug };

  const options = await ServiceOptionService.getAllServiceOptions(filter);

  res.status(200).json({
    status: 'success',
    results: options.length,
    message: 'SubService Options retrieved successfully',
    data: { options },
  });
});

exports.getOneServiceOption = catchAsync(async (req, res, next) => {
  const option = await ServiceOptionService.getOneServiceOption(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'SubService Option retrieved successfully',
    data: { option },
  });
});

exports.createServiceOption = catchAsync(async (req, res, next) => {
  const newOption = await ServiceOptionService.createServiceOption(req.body);

  res.status(201).json({
    status: 'success',
    message: 'SubService Option created successfully',
    data: { option: newOption },
  });
});

exports.updateServiceOption = catchAsync(async (req, res, next) => {
  const updatedOption = await ServiceOptionService.updateServiceOption(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    message: 'SubService Option updated successfully',
    data: { option: updatedOption },
  });
});

exports.deleteServiceOption = catchAsync(async (req, res, next) => {
  await ServiceOptionService.deleteServiceOption(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
