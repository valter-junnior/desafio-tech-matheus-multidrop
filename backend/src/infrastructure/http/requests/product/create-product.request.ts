import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequest {
  @ApiProperty({ description: 'Nome do produto', example: 'Notebook Dell' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({ description: 'Preço do produto', example: 2500.00, minimum: 0 })
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço deve ser maior que zero' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @ApiProperty({ description: 'Produto ativo', example: true, required: false, default: true })
  @IsBoolean({ message: 'Active deve ser um booleano' })
  @IsOptional()
  active?: boolean;
}
