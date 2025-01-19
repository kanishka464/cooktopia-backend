const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    const { success, data } = result;

    console.log(success, data);
    if(success) {
        return ApiResponse.success(
            res,
            200,
            data,
            'Login Successful'
        );
    } else {
        return ApiResponse.error(
            res,
            500,
            "Invalid Credentials"
        )
    }
    
});