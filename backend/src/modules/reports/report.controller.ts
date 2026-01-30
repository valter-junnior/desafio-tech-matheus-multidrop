import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { SalesReportResponseDto } from './dto/sales-report-response.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Gerar relatório de vendas' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Data final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'partnerId', required: false, type: Number, description: 'ID do parceiro' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso', type: SalesReportResponseDto })
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
