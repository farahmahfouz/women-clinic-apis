const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllUsers = async (queryString = {}) => {
  let query = User.find();

  const features = new APIFeatures(query, queryString)
    .filter()
    .search()
    .sort()
    .limitFields()
    .pagination();

  const users = await features.query;
  return users;
};

exports.getOneUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('No User Found', 404);
  return user;
};

exports.createUser = async (userData) => {
  const existUser = await User.findOne({ email: userData.email });
  if (existUser) throw new AppError('User already exist', 400);

  const user = await User.create(userData);
  return user;
};

exports.updateUser = async (id, userData) => {
  if (userData.password)
    throw new AppError('This route is not for password.', 400);

  const user = await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError('No user found', 404);

  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  await User.findByIdAndDelete(id);
};

exports.updateMe = async (id, updatedData) => {
  if(updatedData.password) throw new AppError('This route not for update password.')
  const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};
