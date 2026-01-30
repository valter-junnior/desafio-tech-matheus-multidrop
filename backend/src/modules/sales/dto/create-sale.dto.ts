import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ description: 'ID do produto', example: 1 })
  @IsNumber({}, { message: 'ProductId deve ser um número' })
  @IsNotEmpty({ message: 'ProductId é obrigatório' })
  productId: number;

  @ApiProperty({ description: 'ID do cliente (role CUSTOMER)', example: 2 })
  @IsNumber({}, { message: 'CustomerId deve ser um número' })
  @IsNotEmpty({ message: 'CustomerId é obrigatório' })
  customerId: number;

  @ApiProperty({ description: 'ID do parceiro (role PARTNER)', example: 3 })
  @IsNumber({}, { message: 'PartnerId deve ser um número' })
  @IsNotEmpty({ message: 'PartnerId é obrigatório' })
  partnerId: number;

  @ApiProperty({ description: 'Valor da venda', example: 1500.00, minimum: 0 })
  @IsNumber({}, { message: 'Value deve ser um número' })
  @Min(0, { message: 'Value deve ser maior que zero' })
  @IsNotEmpty({ message: 'Value é obrigatório' })
  value: number;
}
