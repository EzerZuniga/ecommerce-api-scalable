const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');

async function getOrCreateCart(userId) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}

function formatCart(cart) {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      stock: item.product.stock
    },
    lineTotal: Number(item.product.price) * item.quantity
  }));

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    total
  };
}

async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  return formatCart(cart);
}

async function addItemToCart(userId, payload) {
  const product = await prisma.product.findUnique({ where: { id: payload.productId } });
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  if (product.stock < payload.quantity) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Insufficient stock for this product');
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => item.productId === payload.productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + payload.quantity;
    if (newQuantity > product.stock) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Requested quantity exceeds available stock');
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: payload.productId,
        quantity: payload.quantity
      }
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return formatCart(updatedCart);
}

async function removeItemFromCart(userId, cartItemId) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!cart) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Cart not found');
  }

  const item = cart.items.find((cartItem) => cartItem.id === cartItemId);
  if (!item) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Cart item not found');
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return formatCart(updatedCart);
}

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart
};
