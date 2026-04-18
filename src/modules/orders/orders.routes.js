const express = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const controller = require('./orders.controller');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order from current cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', authenticate, controller.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List orders for current user (or all orders for admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order list
 */
router.get('/', authenticate, controller.listOrders);

module.exports = router;
