const SubService = require('../models/subServiceModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllSubServices = async (queryString = {}) => {
  let query = SubService.find().populate({
    path: 'service',
    select: 'name',
  });

  const features = new APIFeatures(query, queryString)
    .filter()
    .search()
    .sort()
    .limitFields()
    .pagination();

  const subServices = await features.query;
  return subServices;
};



exports.getSubService = async (id) => {
  const subService = await SubService.findById(id).populate('options');

  if (!subService) {
    throw new AppError('SubService not found', 404);
  }

  return subService;
};

exports.createSubService = async (data) => {
  const subService = await SubService.create(data);
  return subService;
};

exports.updateSubService = async (id, data) => {
  const subService = await SubService.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!subService) {
    throw new AppError('SubService not found', 404);
  }

  return subService;
};

exports.deleteSubService = async (id) => {
  const subService = await SubService.findByIdAndDelete(id);

  if (!subService) {
    throw new AppError('SubService not found', 404);
  }
};
