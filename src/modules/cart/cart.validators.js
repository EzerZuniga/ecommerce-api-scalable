const { z } = require('zod');

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(100)
});

module.exports = { addToCartSchema };
