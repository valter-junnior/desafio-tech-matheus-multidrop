import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type {
  IReportRepository,
  SalesReportFilters,
  SalesReportResult,
} from '../../../../core/repositories/report.repository';
import { SaleMapper } from '../models/sale/sale.mapper';

@Injectable()
export class ReportRepositoryPrisma implements IReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSalesReport(filters: SalesReportFilters): Promise<SalesReportResult> {
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

    const [salesData, totalSales, totalValueAgg] = await Promise.all([
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

    const sales = salesData.map((saleData) =>
      SaleMapper.toDomain(saleData as any),
    );

    return {
      sales,
      totalSales,
      totalValue: totalValueAgg._sum.value || 0,
    };
  }
}
