import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { SalesReportResponseDto } from './dto/sales-report-response.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  async getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('partnerId') partnerId?: string,
  ): Promise<SalesReportResponseDto> {
    return this.reportService.getSalesReport({
      startDate,
      endDate,
      partnerId: partnerId ? parseInt(partnerId, 10) : undefined,
    });
  }
}
