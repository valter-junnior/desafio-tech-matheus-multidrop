import { ApiProperty } from '@nestjs/swagger';
import { SalesReportResponseDto } from '../../../application/dtos/sale/sales-report-response.dto';

export class SalesReportPresenter {
  @ApiProperty({ description: 'Total de vendas no período', example: 6 })
  totalSales: number;

  @ApiProperty({ description: 'Valor total das vendas', example: 9500.00 })
  totalValue: number;

  @ApiProperty({
    description: 'Filtros aplicados no relatório',
    example: { startDate: '2024-01-01', endDate: '2024-12-31', partnerId: 3 },
  })
  filters: {
    startDate?: string;
    endDate?: string;
    partnerId?: number;
  };

  @ApiProperty({
    description: 'Lista de vendas no relatório',
    type: 'array',
    example: [
      {
        id: 1,
        value: 1500.0,
        quantity: 2,
        createdAt: '2024-01-15T10:30:00.000Z',
        product: { id: 1, name: 'Notebook Dell' },
        customer: { id: 2, name: 'Maria Santos' },
        partner: { id: 3, name: 'João Silva' },
      },
    ],
  })
  sales: Array<{
    id: number;
    value: number;
    quantity: number;
    createdAt: Date;
    product: {
      id: number;
      name: string;
    };
    customer: {
      id: number;
      name: string;
    };
    partner: {
      id: number;
      name: string;
    };
  }>;

  static fromDto(dto: SalesReportResponseDto): SalesReportPresenter {
    const presenter = new SalesReportPresenter();
    presenter.totalSales = dto.totalSales;
    presenter.totalValue = dto.totalValue;
    presenter.filters = dto.filters;
    presenter.sales = dto.sales;
    return presenter;
  }
}
