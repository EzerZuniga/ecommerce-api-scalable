const { checkoutSchema } = require('../../src/modules/payments/payments.validators');

describe('checkoutSchema', () => {
  it('accepts a valid payload', () => {
    const parsed = checkoutSchema.safeParse({
      orderId: 'order_123',
      cardNumber: '4111111111111111'
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects invalid card numbers', () => {
    const parsed = checkoutSchema.safeParse({
      orderId: 'order_123',
      cardNumber: '1234'
    });

    expect(parsed.success).toBe(false);
  });
});
