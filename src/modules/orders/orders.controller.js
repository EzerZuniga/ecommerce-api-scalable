const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./orders.service');

const createOrder = asyncHandler(async (req, res) => {
  const order = await service.createOrderFromCart(req.user.id);
  res.status(StatusCodes.CREATED).json({ data: order });
});

const listOrders = asyncHandler(async (req, res) => {
  const orders = await service.listOrders(req.user);
  res.status(StatusCodes.OK).json({ data: orders });
});

module.exports = {
  createOrder,
  listOrders
};
