import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

export interface SalesReportFilters {
  startDate?: Date;
  endDate?: Date;
  partnerId?: number;
}

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async getSalesReport(filters: SalesReportFilters) {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters.partnerId) {
      where.partnerId = filters.partnerId;
    }

    const [sales, totalSales, totalValue] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.sale.count({ where }),
      this.prisma.sale.aggregate({
        where,
        _sum: {
          value: true,
        },
      }),
    ]);

    return {
      sales,
      totalSales,
      totalValue: totalValue._sum.value || 0,
    };
  }
}
