const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/AppError');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication is required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(StatusCodes.FORBIDDEN, 'Insufficient permissions'));
    }

    return next();
  };
}

module.exports = { authorize };
