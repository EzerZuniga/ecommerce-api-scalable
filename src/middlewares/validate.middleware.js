const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/AppError');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          'Validation failed',
          result.error.flatten().fieldErrors
        )
      );
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = { validate };
