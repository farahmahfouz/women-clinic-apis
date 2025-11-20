const Settings = require('../models/settingModel');
const AppError = require('../utils/appError');

exports.getSettings = async () => {
  const settings = await Settings.find();
  return settings;
};

exports.createSettings = async (data) => {
  const existSettings = await Settings.findOne({ clinicName: data.clinicName });
  if (existSettings) throw new AppError('Settings already exist', 400);
  const settings = await Settings.create(data);
  return settings;
};

exports.updateSettings = async (id, data) => {
  const settings = await Settings.findByIdAndUpdate(id, data);
  if (!settings) throw new AppError('Settings not found', 404);
  return settings;
};
