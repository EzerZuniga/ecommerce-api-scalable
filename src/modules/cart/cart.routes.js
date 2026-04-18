const express = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const controller = require('./cart.controller');
const { addToCartSchema } = require('./cart.validators');

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get('/', authenticate, controller.getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.post('/add', authenticate, validate(addToCartSchema), controller.addToCart);

/**
 * @swagger
 * /api/cart/remove/{id}:
 *   delete:
 *     summary: Remove cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.delete('/remove/:id', authenticate, controller.removeFromCart);

module.exports = router;
