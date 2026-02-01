const ServiceOption = require('../models/serviceOptionModel');
const AppError = require('../utils/appError');

exports.getAllServiceOptions = async (filter) => {
  const serviceOptions = await ServiceOption.find(filter);
  return serviceOptions;
};

exports.getOneServiceOption = async (id) => {
  const serviceOption = await ServiceOption.findById(id);
  if (!serviceOption) throw new AppError('ServiceOption not found', 404);
  return serviceOption;
};

exports.createServiceOption = async (data) => {
  const existServiceOption = await ServiceOption.findOne({
    optionName: data.optionName,
  });
  if (existServiceOption)
    throw new AppError('ServiceOption is already exist', 400);

  const newServiceOption = await ServiceOption.create(data);
  return newServiceOption;
};

exports.updateServiceOption = async (id, data) => {
  const serviceOption = await ServiceOption.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!serviceOption) throw new AppError('ServiceOption not found', 404);
  return serviceOption;
};

exports.deleteServiceOption = async (id) => {
  const existServiceOption = await ServiceOption.findById(id);
  if (!existServiceOption) throw new AppError('ServiceOption not found', 404);
  await ServiceOption.findByIdAndDelete(id);
};
