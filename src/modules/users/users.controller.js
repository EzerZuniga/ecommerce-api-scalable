const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

module.exports = { getProfile };
