import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { SalesReportResponseDto } from './dto/sales-report-response.dto';

export interface SalesReportQuery {
  startDate?: string;
  endDate?: string;
  partnerId?: number;
}

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

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

    return new SalesReportResponseDto({
      totalSales,
      totalValue,
      filters: {
        startDate: query.startDate,
        endDate: query.endDate,
        partnerId: query.partnerId,
      },
      sales,
    });
  }
}
