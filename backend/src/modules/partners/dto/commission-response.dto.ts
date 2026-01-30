import { ApiProperty } from '@nestjs/swagger';

export class CommissionResponseDto {
  @ApiProperty({ description: 'ID do parceiro', example: 3 })
  partnerId: number;

  @ApiProperty({ description: 'Nome do parceiro', example: 'João Silva' })
  partnerName: string;

  @ApiProperty({ description: 'Total de vendas realizadas', example: 5 })
  totalSales: number;

  @ApiProperty({ description: 'Valor total das vendas', example: 7500.00 })
  totalValue: number;

  @ApiProperty({ description: 'Total de comissão (10%)', example: 750.00 })
  totalCommission: number;

  @ApiProperty({ description: 'Taxa de comissão', example: 0.10 })
  commissionRate: number;

  constructor(partial: Partial<CommissionResponseDto>) {
    Object.assign(this, partial);
  }
}
