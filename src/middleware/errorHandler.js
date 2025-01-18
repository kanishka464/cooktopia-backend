const { ApiResponse } = require('../utils/apiResponse');

const errorHandler = ( err, req, res, next ) => {
    console.log(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Servor Error";

    return ApiResponse.error(res, statusCode, message);
};

module.exports = errorHandler;