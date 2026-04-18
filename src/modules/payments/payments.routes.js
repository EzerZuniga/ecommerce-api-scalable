const express = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const controller = require('./payments.controller');
const { checkoutSchema } = require('./payments.validators');

const router = express.Router();

/**
 * @swagger
 * /api/payments/checkout:
 *   post:
 *     summary: Simulate payment checkout for a pending order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment successful
 */
router.post('/checkout', authenticate, validate(checkoutSchema), controller.checkout);

module.exports = router;
