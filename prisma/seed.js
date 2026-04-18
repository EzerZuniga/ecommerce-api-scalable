const bcrypt = require('bcryptjs');
const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin12345', 10);

  await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      role: UserRole.ADMIN
    }
  });

  const products = [
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches.',
      price: 79.99,
      stock: 25
    },
    {
      name: 'Gaming Mouse',
      description: 'Ergonomic mouse with adjustable DPI.',
      price: 39.99,
      stock: 40
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 hub with HDMI and power delivery.',
      price: 49.99,
      stock: 30
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
