const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../../utils/asyncHandler');
const service = require('./products.service');

const listProducts = asyncHandler(async (req, res) => {
  const result = await service.listProducts(req.query);
  res.status(StatusCodes.OK).json(result);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await service.getProductById(req.params.id);
  res.status(StatusCodes.OK).json({ data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await service.createProduct(req.body);
  res.status(StatusCodes.CREATED).json({ data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await service.updateProduct(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await service.deleteProduct(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
