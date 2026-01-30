import { ApiProperty } from '@nestjs/swagger';
import { SaleEntity } from '../entities/sale.entity';

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

  constructor(partial: Partial<SaleResponseDto> | SaleEntity) {
    if (partial instanceof SaleEntity) {
      const obj = partial.toObject();
      Object.assign(this, {
        id: obj.id,
        productId: obj.productId,
        customerId: obj.customerId,
        partnerId: obj.partnerId,
        value: obj.value,
        createdAt: obj.createdAt,
      });
    } else {
      Object.assign(this, partial);
    }
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

  constructor(partial: Partial<SaleDetailResponseDto> | SaleEntity) {
    super(partial);
    if (partial instanceof SaleEntity) {
      const obj = partial.toObject();
      this.product = obj.product ? {
        id: obj.product.id,
        name: obj.product.name,
        price: obj.product.price,
      } : undefined;
      this.customer = obj.customer ? {
        id: obj.customer.id,
        name: obj.customer.name,
        email: obj.customer.email,
      } : undefined;
      this.partner = obj.partner ? {
        id: obj.partner.id,
        name: obj.partner.name,
        email: obj.partner.email,
      } : undefined;
    } else {
      Object.assign(this, partial);
    }
  }
}
