import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpar dados existentes
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@marketplace.com',
      role: UserRole.ADMIN,
    },
  });

  const partner1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@partner.com',
      role: UserRole.PARTNER,
    },
  });

  const partner2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria.santos@partner.com',
      role: UserRole.PARTNER,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'carlos@customer.com',
      role: UserRole.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Ana Paula',
      email: 'ana@customer.com',
      role: UserRole.CUSTOMER,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Pedro Almeida',
      email: 'pedro@customer.com',
      role: UserRole.CUSTOMER,
    },
  });

  console.log('✅ Users created');

  // Criar produtos
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

  console.log('✅ Products created');

  // Criar vendas
  await prisma.sale.create({
    data: {
      productId: product1.id,
      customerId: customer1.id,
      partnerId: partner1.id,
      value: product1.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product2.id,
      customerId: customer2.id,
      partnerId: partner1.id,
      value: product2.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product3.id,
      customerId: customer3.id,
      partnerId: partner1.id,
      value: product3.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product4.id,
      customerId: customer1.id,
      partnerId: partner2.id,
      value: product4.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product1.id,
      customerId: customer2.id,
      partnerId: partner2.id,
      value: product1.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product2.id,
      customerId: customer3.id,
      partnerId: partner2.id,
      value: product2.price,
    },
  });

  console.log('✅ Sales created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
