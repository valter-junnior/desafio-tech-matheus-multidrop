import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateSaleDto {
  @IsNumber({}, { message: 'ProductId deve ser um número' })
  @IsNotEmpty({ message: 'ProductId é obrigatório' })
  productId: number;

  @IsNumber({}, { message: 'CustomerId deve ser um número' })
  @IsNotEmpty({ message: 'CustomerId é obrigatório' })
  customerId: number;

  @IsNumber({}, { message: 'PartnerId deve ser um número' })
  @IsNotEmpty({ message: 'PartnerId é obrigatório' })
  partnerId: number;

  @IsNumber({}, { message: 'Value deve ser um número' })
  @Min(0, { message: 'Value deve ser maior que zero' })
  @IsNotEmpty({ message: 'Value é obrigatório' })
  value: number;
}
