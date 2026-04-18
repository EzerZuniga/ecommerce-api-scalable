const { z } = require('zod');

const checkoutSchema = z.object({
  orderId: z.string().min(1),
  cardNumber: z.string().regex(/^\d{16}$/, 'cardNumber must be exactly 16 digits')
});

module.exports = { checkoutSchema };
