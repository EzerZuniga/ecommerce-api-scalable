const { StatusCodes } = require('http-status-codes');
const { Prisma, UserRole, OrderStatus } = require('@prisma/client');
const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');

function formatOrder(order) {
  return {
    id: order.id,
    userId: order.userId,
    total: Number(order.total),
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    user: order.user
      ? {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email
        }
      : undefined,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.unitPrice) * item.quantity
    }))
  };
}

async function createOrderFromCart(userId) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Cart is empty');
    }

    let total = new Prisma.Decimal(0);

    for (const item of cart.items) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity }
        },
        data: {
          stock: { decrement: item.quantity }
        }
      });

      if (stockUpdate.count === 0) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for product ${item.product.name}`
        );
      }

      total = total.plus(item.product.price.mul(item.quantity));
    }

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return formatOrder(order);
  });
}

async function listOrders(user) {
  const where = user.role === UserRole.ADMIN ? {} : { userId: user.id };
  const include = {
    items: true
  };

  if (user.role === UserRole.ADMIN) {
    include.user = {
      select: { id: true, name: true, email: true }
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include,
    orderBy: { createdAt: 'desc' }
  });

  return orders.map(formatOrder);
}

async function getOrderByIdForUser(orderId, user) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true
    }
  });

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (user.role !== UserRole.ADMIN && order.userId !== user.id) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You cannot access this order');
  }

  return order;
}

module.exports = {
  createOrderFromCart,
  listOrders,
  getOrderByIdForUser
};
