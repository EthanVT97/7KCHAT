const errorHandlingService = require('../services/errorHandlingService');

module.exports = (err, req, res, next) => {
    // Log error
    const errorResponse = errorHandlingService.handleError(err, {
        url: req.url,
        method: req.method,
        body: req.body,
        user: req.user?.id
    });

    // Handle different types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: true,
            type: 'VALIDATION_ERROR',
            message: err.message,
            details: Object.values(err.errors).map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({
            error: true,
            type: 'DUPLICATE_ERROR',
            message: 'Duplicate key error',
            field: Object.keys(err.keyValue)[0]
        });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(errorResponse);
}; 