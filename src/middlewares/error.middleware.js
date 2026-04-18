const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

function notFoundHandler(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const response = {
    message: error.message || 'Internal server error'
  };

  if (error.details) {
    response.details = error.details;
  }

  if (statusCode >= 500) {
    logger.error('Unhandled error', {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method
    });
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
