const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./cart.service');

const getCart = asyncHandler(async (req, res) => {
  const cart = await service.getCart(req.user.id);
  res.status(StatusCodes.OK).json({ data: cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const cart = await service.addItemToCart(req.user.id, req.body);
  res.status(StatusCodes.OK).json({ data: cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await service.removeItemFromCart(req.user.id, req.params.id);
  res.status(StatusCodes.OK).json({ data: cart });
});

module.exports = {
  getCart,
  addToCart,
  removeFromCart
};
