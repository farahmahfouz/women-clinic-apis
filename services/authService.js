const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.signup = async (userData) => {
  if (userData?.role && userData.role !== 'patient') {
    throw new AppError('You are not allowed to sign up with this role', 400);
  }

  const existingUser = await User.findOne({ email: userData?.email });
  if (existingUser) throw new AppError('User already exists', 400);

  const payload = { ...userData, role: 'patient' };
  const newUser = await User.create(payload);

  if (!newUser) throw new AppError('Failed to create user', 500);

  return newUser;
};

exports.login = async (userData) => {
  const { email, password } = userData;

  if (!email || !password)
    throw new AppError('Please provide email and password', 400);

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password)))
    throw new AppError('Invalid email or password', 401);

  return user;
};
