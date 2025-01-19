const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getUsers();
    return ApiResponse.success(res, 200, users, 'Users retrieved successfully');
})

exports.insertOneUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const savedUser = await userService.insertUser(req.body);
    return ApiResponse.success(res, 200, savedUser, "user saved successfully");
})