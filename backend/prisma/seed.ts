import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seeder';
import { seedProducts } from './seeders/product.seeder';
import { seedSales } from './seeders/sale.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Limpar dados existentes
  console.log('🧹 Cleaning existing data...');
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Data cleaned\n');

  // Executar seeders
  const users = await seedUsers(prisma);
  const products = await seedProducts(prisma);
  
  await seedSales(prisma, {
    products: products.map(p => ({ id: p.id, price: p.price })),
    customers: users.customers.map(c => ({ id: c.id })),
    partners: users.partners.map(p => ({ id: p.id })),
  });

  console.log('\n🎉 Database seeding completed successfully!');
  console.log(`
📊 Summary:
  - Users: ${users.partners.length + users.customers.length + 1}
    • Admin: 1
    • Partners: ${users.partners.length}
    • Customers: ${users.customers.length}
  - Products: ${products.length}
  - Sales: Multiple sales created
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
