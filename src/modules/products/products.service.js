const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const getRedisClient = require('../../config/redis');
const AppError = require('../../utils/AppError');
const { parsePagination } = require('../../utils/pagination');

function formatProduct(product) {
  return {
    ...product,
    price: Number(product.price)
  };
}

async function clearProductsCache() {
  const redis = getRedisClient();
  if (!redis || redis.status !== 'ready') {
    return;
  }

  const keys = await redis.keys('products:list:*');
  if (keys.length > 0) {
    await redis.del(keys);
  }
}

async function listProducts(query) {
  const { page, limit, skip } = parsePagination(query);
  const redis = getRedisClient();
  const cacheKey = `products:list:${JSON.stringify({ ...query, page, limit })}`;

  if (redis && redis.status === 'ready') {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const where = {};
  if (query.name) {
    where.name = { contains: query.name, mode: 'insensitive' };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  const response = {
    data: items.map(formatProduct),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };

  if (redis && redis.status === 'ready') {
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60);
  }

  return response;
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  return formatProduct(product);
}

async function createProduct(payload) {
  const product = await prisma.product.create({ data: payload });
  await clearProductsCache();
  return formatProduct(product);
}

async function updateProduct(id, payload) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const product = await prisma.product.update({
    where: { id },
    data: payload
  });

  await clearProductsCache();
  return formatProduct(product);
}

async function deleteProduct(id) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  await prisma.product.delete({ where: { id } });
  await clearProductsCache();
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
