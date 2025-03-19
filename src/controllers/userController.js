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

exports.followUser = asyncHandler(async (req, res) => {
    const response = await userService.followUser(req);
    if(response?.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
})

exports.unfollowUser = asyncHandler(async (req, res) => {
    const response = await userService.unfollowUser(req);
    if(response?.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
})

exports.getUserProfileDetails = asyncHandler(async (req, res) => {
    const response = await userService.getUserProfileDetails(req);
    if(response?.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
})

exports.getRecentActivity = asyncHandler(async (req, res) => {
    const response = await userService.getRecentActivity(req);
    if(response?.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
})

exports.updateProfilePicture = asyncHandler(async (req, res) => {
    const response = await userService.updateProfilePicture(req);
    if(response?.success) 
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
})