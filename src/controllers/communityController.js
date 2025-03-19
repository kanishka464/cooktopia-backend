const communityService = require('../services/communityservice');
const { ApiResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.post = asyncHandler(async (req, res) => {
    const response = await communityService.post(req.body);
    if(response.success)
        return ApiResponse.success(res, 200, response.data, response.message);
    else
        return ApiResponse.error(res, 500, response.message);
});

exports.listPost = asyncHandler(async (req, res) => {
    const response = await communityService.listPost();
    if(response.success)
        return ApiResponse.success(res, 200, response?.data, response?.message);
    else
        return ApiResponse.error(res, 500, response?.message);
})