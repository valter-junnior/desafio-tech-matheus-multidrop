import { PrismaClient } from '@prisma/client';
import { seedSales } from './seeders/sale.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding only sales...\n');

  await prisma.sale.deleteMany();
  
  // Buscar dados existentes
  const products = await prisma.product.findMany({
    select: { id: true, price: true },
  });
  
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: { id: true },
  });
  
  const partners = await prisma.user.findMany({
    where: { role: 'PARTNER' },
    select: { id: true },
  });

  if (!products.length || !customers.length || !partners.length) {
    throw new Error('Você precisa ter produtos, clientes e parceiros antes de criar vendas. Execute: npm run prisma:seed:users e npm run prisma:seed:products primeiro.');
  }

  await seedSales(prisma, {
    products,
    customers,
    partners,
  });

  console.log('\n✅ Sale seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Sale seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
