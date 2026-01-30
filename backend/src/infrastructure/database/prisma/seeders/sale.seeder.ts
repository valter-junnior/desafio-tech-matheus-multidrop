import { PrismaClient, Sale } from 'src/generated/prisma/client';

interface SaleSeederData {
  products: Array<{ id: number; price: number }>;
  customers: Array<{ id: number }>;
  partners: Array<{ id: number }>;
}

export async function seedSales(prisma: PrismaClient, data: SaleSeederData) {
  console.log('🌱 Seeding sales...');

  const { products, customers, partners } = data;

  // Validação dos dados
  if (!products.length || !customers.length || !partners.length) {
    throw new Error('Produtos, clientes e parceiros devem existir antes de criar vendas');
  }

  // Criar vendas variadas
  const sales: Sale[] = [];

  // Vendas do Partner 1
  sales.push(
    await prisma.sale.create({
      data: {
        productId: products[0].id,
        customerId: customers[0].id,
        partnerId: partners[0].id,
        value: products[0].price,
      },
    }),
  );

  sales.push(
    await prisma.sale.create({
      data: {
        productId: products[1].id,
        customerId: customers[1].id,
        partnerId: partners[0].id,
        value: products[1].price,
      },
    }),
  );

  sales.push(
    await prisma.sale.create({
      data: {
        productId: products[2].id,
        customerId: customers[2].id,
        partnerId: partners[0].id,
        value: products[2].price,
      },
    }),
  );

  // Vendas do Partner 2
  if (partners.length > 1) {
    sales.push(
      await prisma.sale.create({
        data: {
          productId: products[3].id,
          customerId: customers[0].id,
          partnerId: partners[1].id,
          value: products[3].price,
        },
      }),
    );

    sales.push(
      await prisma.sale.create({
        data: {
          productId: products[0].id,
          customerId: customers[1].id,
          partnerId: partners[1].id,
          value: products[0].price,
        },
      }),
    );

    sales.push(
      await prisma.sale.create({
        data: {
          productId: products[1].id,
          customerId: customers[2].id,
          partnerId: partners[1].id,
          value: products[1].price,
        },
      }),
    );
  }

  // Mais vendas variadas
  if (products.length > 5) {
    sales.push(
      await prisma.sale.create({
        data: {
          productId: products[5].id,
          customerId: customers[0].id,
          partnerId: partners[0].id,
          value: products[5].price,
        },
      }),
    );

    sales.push(
      await prisma.sale.create({
        data: {
          productId: products[6].id,
          customerId: customers[1].id,
          partnerId: partners[1].id,
          value: products[6].price,
        },
      }),
    );
  }

  console.log(`✅ ${sales.length} sales seeded successfully`);

  return sales;
}
