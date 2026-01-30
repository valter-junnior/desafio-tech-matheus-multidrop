import { PrismaClient } from 'generated/prisma/client';
import { seedUsers } from './seeders/user.seeder';
import { seedProducts } from './seeders/product.seeder';
import { seedSales } from './seeders/sale.seeder';

const prisma = new PrismaClient();

// Pegar argumentos da linha de comando
const args = process.argv.slice(2);
const nameArg = args.find(arg => arg.startsWith('--name='));
const seederNames = nameArg 
  ? nameArg.split('=')[1].split(',').map(s => s.trim())
  : ['all'];

async function seedAll() {
  console.log('🌱 Starting complete database seeding...\n');

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

async function seedOnlyUsers() {
  console.log('🌱 Seeding only users...\n');
  await prisma.user.deleteMany();
  await seedUsers(prisma);
  console.log('\n✅ User seeding completed!');
}

async function seedOnlyProducts() {
  console.log('🌱 Seeding only products...\n');
  await prisma.product.deleteMany();
  await seedProducts(prisma);
  console.log('\n✅ Product seeding completed!');
}

async function seedOnlySales() {
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
    throw new Error('You need products, customers and partners before creating sales. Run: npm run prisma:seed -- --name=users,products');
  }

  await seedSales(prisma, {
    products,
    customers,
    partners,
  });

  console.log('\n✅ Sale seeding completed!');
}

async function runSeeders(names: string[]) {
  console.log(`🌱 Running seeders: ${names.join(', ')}\n`);
  
  for (const name of names) {
    switch (name.toLowerCase()) {
      case 'users':
        await seedOnlyUsers();
        break;
      case 'products':
        await seedOnlyProducts();
        break;
      case 'sales':
        await seedOnlySales();
        break;
      default:
        console.log(`⚠️  Unknown seeder: ${name}`);
    }
  }
  
  console.log('\n🎉 Seeding completed!');
}

async function main() {
  if (seederNames.includes('all')) {
    await seedAll();
  } else {
    await runSeeders(seederNames);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
