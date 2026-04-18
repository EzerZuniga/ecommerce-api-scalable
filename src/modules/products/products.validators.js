const { z } = require('zod');

const productInput = {
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(10).max(1000),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0)
};

const createProductSchema = z.object(productInput);

const updateProductSchema = z
  .object({
    name: productInput.name.optional(),
    description: productInput.description.optional(),
    price: productInput.price.optional(),
    stock: productInput.stock.optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  });

const listProductsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    name: z.string().trim().min(1).optional()
  })
  .refine((data) => data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice, {
    message: 'minPrice must be less than or equal to maxPrice'
  });

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema
};
