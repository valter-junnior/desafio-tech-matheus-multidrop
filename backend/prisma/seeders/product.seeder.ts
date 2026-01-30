import { PrismaClient } from 'generated/prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  console.log('🌱 Seeding products...');

  const product1 = await prisma.product.create({
    data: {
      name: 'Curso de TypeScript Avançado',
      price: 299.90,
      active: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Curso de NestJS',
      price: 399.90,
      active: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Curso de React com TypeScript',
      price: 349.90,
      active: true,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Mentoria Individual',
      price: 1500.00,
      active: true,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'E-book Clean Architecture',
      price: 49.90,
      active: false,
    },
  });

  const product6 = await prisma.product.create({
    data: {
      name: 'Curso de Node.js',
      price: 279.90,
      active: true,
    },
  });

  const product7 = await prisma.product.create({
    data: {
      name: 'Workshop de Domain-Driven Design',
      price: 599.00,
      active: true,
    },
  });

  console.log('✅ Products seeded successfully');

  return [product1, product2, product3, product4, product5, product6, product7];
}
