import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding only users...\n');

  await prisma.user.deleteMany();
  
  await seedUsers(prisma);

  console.log('\n✅ User seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ User seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
