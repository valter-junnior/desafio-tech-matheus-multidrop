import { PrismaClient, UserRole } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...');

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

  console.log('✅ Users seeded successfully');

  return {
    admin,
    partners: [partner1, partner2],
    customers: [customer1, customer2, customer3],
  };
}
