const Service = require('../models/serviceModel');
const AppError = require('../utils/appError');

exports.getAllServices = async () => {
  const services = await Service.find().populate('options');
  return services;
};

exports.getOneService = async (id) => {
  const service = await Service.findById(id);
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
