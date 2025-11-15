const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');

exports.getUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({
        status: 'success',
        results: users.length,
        message: 'Users fetched successfully',
        data: users,
    });
});