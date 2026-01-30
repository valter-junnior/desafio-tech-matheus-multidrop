import { ApiProperty } from '@nestjs/swagger';

export class SalesReportResponseDto {
  @ApiProperty({ description: 'Total de vendas no período', example: 6 })
  totalSales: number;

  @ApiProperty({ description: 'Valor total das vendas', example: 9500.00 })
  totalValue: number;

  @ApiProperty({ 
    description: 'Filtros aplicados no relatório',
    example: { startDate: '2024-01-01', endDate: '2024-12-31', partnerId: 3 }
  })
  filters: {
    startDate?: string;
    endDate?: string;
    partnerId?: number;
  };

  @ApiProperty({ 
    description: 'Lista de vendas no relatório',
    type: 'array',
    example: [{
      id: 1,
      value: 1500.00,
      createdAt: '2024-01-15T10:30:00.000Z',
      product: { id: 1, name: 'Notebook Dell', price: 2500.00 },
      customer: { id: 2, name: 'Maria Santos', email: 'maria@example.com' },
      partner: { id: 3, name: 'João Silva', email: 'joao@example.com' }
    }]
  })
  sales: Array<{
    id: number;
    value: number;
    createdAt: Date;
    product: {
      id: number;
      name: string;
      price: number;
    };
    customer: {
      id: number;
      name: string;
      email: string;
    };
    partner: {
      id: number;
      name: string;
      email: string;
    };
  }>;

  constructor(partial: Partial<SalesReportResponseDto>) {
    Object.assign(this, partial);
  }
}
