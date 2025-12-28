const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');

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

exports.forgotPassword = async (email, req) => {
  if (!email) throw new AppError('Please provide an email', 400);
  
  const user = await User.findOne({ email });
  if (!user) throw new AppError('There is no user with that email', 404);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();

    return {
      message: 'Token sent to email!'
    };
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
};

exports.resetPassword = async (token, password) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError('Token is invalid or has expired', 400);

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};