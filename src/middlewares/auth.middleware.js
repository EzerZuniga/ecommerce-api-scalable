const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/AppError');
const prisma = require('../config/prisma');
const { verifyToken } = require('../utils/jwt');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'Authentication token is required'));
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, name: true }
    });

    if (!user) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token user'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }
}

module.exports = { authenticate };
