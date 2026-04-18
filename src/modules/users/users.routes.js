const express = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const controller = require('./users.controller');

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 */
router.get('/me', authenticate, controller.getProfile);

module.exports = router;
