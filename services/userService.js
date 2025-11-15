const User = require('../models/userModel');

exports.getAllUsers = async () => {
  const users = await User.find();
  if (!users) {
    throw new Error('No users found');
  }
  return users;
};
