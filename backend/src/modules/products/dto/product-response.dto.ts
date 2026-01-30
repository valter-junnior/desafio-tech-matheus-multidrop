import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID do produto', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do produto', example: 'Notebook Dell' })
  name: string;

  @ApiProperty({ description: 'Preço do produto', example: 2500.00 })
  price: number;

  @ApiProperty({ description: 'Produto está ativo', example: true })
  active: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
