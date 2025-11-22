const Service = require('../models/serviceModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllServices = async (queryString = {}) => {
  let query = Service.find().populate('options');

  const features = new APIFeatures(query, queryString)
    .filter()
    .search()
    .sort()
    .limitFields()
    .pagination();

  const services = await features.query;
  return services;
};

exports.getOneService = async (id) => {
  const service = await Service.findById(id).populate('review');
  if (!service) throw new AppError('Service not found', 404);
  return service;
};

exports.createService = async (data) => {
  const serviceExist = await Service.findOne({ name: data.name });
  if (serviceExist) throw new AppError('Service already exist', 400);
  const service = await Service.create(data);
  return service;
};

exports.updateService = async (id, data) => {
  const service = await Service.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!service) throw new AppError('Service not found', 404);

  return service;
};

exports.deleteService = async (id) => {
  const service = await Service.findByIdAndDelete(id);
  if (!service) throw new AppError('Service not found', 404);
};
