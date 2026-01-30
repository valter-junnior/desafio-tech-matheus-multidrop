import { PrismaClient } from '@prisma/client';
import { seedProducts } from './seeders/product.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding only products...\n');

  await prisma.product.deleteMany();
  
  await seedProducts(prisma);

  console.log('\n✅ Product seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Product seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
