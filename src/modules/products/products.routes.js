const express = require('express');
const { UserRole } = require('@prisma/client');

const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const controller = require('./products.controller');
const {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema
} = require('./products.validators');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product list
 */
router.get('/', validate(listProductsQuerySchema, 'query'), controller.listProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createProductSchema),
  controller.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateProductSchema),
  controller.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), controller.deleteProduct);

module.exports = router;
