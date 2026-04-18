const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./payments.service');

const checkout = asyncHandler(async (req, res) => {
  const result = await service.checkout(req.user, req.body);
  res.status(StatusCodes.OK).json(result);
});

module.exports = {
  checkout
};
