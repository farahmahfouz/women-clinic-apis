const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');

//:TODO: handle flitering on this route soon
exports.getUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    message: 'Users fetched successfully',
    data: { users },
  });
});

exports.getOneUser = catchAsync(async (req, res) => {
  const user = await userService.getOneUser(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'User found successfully',
    data: { user },
  });
});

//TODO: handle activation on this route
// This is only for admin to create account to employees and doctors
exports.createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: { user },
  });
});
