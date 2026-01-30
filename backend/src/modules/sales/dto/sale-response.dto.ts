import { ApiProperty } from '@nestjs/swagger';

export class SaleResponseDto {
  @ApiProperty({ description: 'ID da venda', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID do produto', example: 1 })
  productId: number;

  @ApiProperty({ description: 'ID do cliente', example: 2 })
  customerId: number;

  @ApiProperty({ description: 'ID do parceiro', example: 3 })
  partnerId: number;

  @ApiProperty({ description: 'Valor da venda', example: 1500.00 })
  value: number;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  constructor(partial: Partial<SaleResponseDto>) {
    Object.assign(this, partial);
  }
}

export class SaleDetailResponseDto extends SaleResponseDto {
  @ApiProperty({ description: 'Dados do produto', required: false })
  product?: {
    id: number;
    name: string;
    price: number;
  };

  @ApiProperty({ description: 'Dados do cliente', required: false })
  customer?: {
    id: number;
    name: string;
    email: string;
  };

  @ApiProperty({ description: 'Dados do parceiro', required: false })
  partner?: {
    id: number;
    name: string;
    email: string;
  };

  constructor(partial: Partial<SaleDetailResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
