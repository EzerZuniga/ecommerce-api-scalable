const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const { UserRole } = require('@prisma/client');

const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { signToken } = require('../../utils/jwt');

async function registerUser(payload) {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: UserRole.CUSTOMER
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  return { user, token };
}

async function loginUser(payload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(payload.password, user.password);
  if (!isValid) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

module.exports = {
  registerUser,
  loginUser
};
