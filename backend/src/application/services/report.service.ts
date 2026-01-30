import { Injectable, Inject } from '@nestjs/common';
import type { IReportRepository } from '../../core/repositories/report.repository';
import { REPORT_REPOSITORY } from '../../core/repositories/report.repository';
import { SalesReportResponseDto, SalesReportQuery } from '../dtos/sale/sales-report-response.dto';

@Injectable()
export class ReportService {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: IReportRepository,
  ) {}

  async getSalesReport(query: SalesReportQuery): Promise<SalesReportResponseDto> {
    const filters: any = {};

    if (query.startDate) {
      filters.startDate = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.endDate = new Date(query.endDate);
    }

    if (query.partnerId) {
      filters.partnerId = query.partnerId;
    }

    const { sales, totalSales, totalValue } = await this.reportRepository.getSalesReport(filters);

    const salesData = sales.map((sale) => ({
      id: sale.id,
      value: sale.value,
      quantity: 1,
      createdAt: sale.createdAt,
      product: {
        id: sale.product?.id ?? 0,
        name: sale.product?.name ?? '',
      },
      customer: {
        id: sale.customer?.id ?? 0,
        name: sale.customer?.name ?? '',
      },
      partner: {
        id: sale.partner?.id ?? 0,
        name: sale.partner?.name ?? '',
      },
    }));

    return new SalesReportResponseDto({
      totalSales,
      totalValue,
      filters: {
        startDate: query.startDate,
        endDate: query.endDate,
        partnerId: query.partnerId,
      },
      sales: salesData,
    });
  }
}
