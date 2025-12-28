const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const userData = req.body;
  const newUser = await authService.signup(userData);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const userData = req.body;
  const user = await authService.login(userData);
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const response = await authService.forgotPassword(email, req);

  res.status(200).json({
    status: 'success',
    message: response.message,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await authService.resetPassword(token, password);

  createSendToken(user, 200, res);
});
