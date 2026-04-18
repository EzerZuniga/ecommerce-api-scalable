const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(StatusCodes.CREATED).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(StatusCodes.OK).json(result);
});

module.exports = {
  register,
  login
};
