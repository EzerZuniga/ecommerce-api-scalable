const { StatusCodes } = require('http-status-codes');
const { OrderStatus } = require('@prisma/client');
const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { getOrderByIdForUser } = require('../orders/orders.service');

function isPaymentApproved(cardNumber) {
  return cardNumber === '4111111111111111';
}

async function checkout(user, payload) {
  const order = await getOrderByIdForUser(payload.orderId, user);

  if (order.status !== OrderStatus.PENDING) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Only pending orders can be paid');
  }

  if (!isPaymentApproved(payload.cardNumber)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Payment rejected by simulated gateway');
  }

  const updated = await prisma.order.updateMany({
    where: { id: order.id, status: OrderStatus.PENDING },
    data: { status: OrderStatus.PAID }
  });

  if (updated.count === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Order was already processed');
  }

  return {
    message: 'Pago exitoso',
    orderId: order.id,
    orderStatus: OrderStatus.PAID.toLowerCase()
  };
}

module.exports = {
  checkout
};
