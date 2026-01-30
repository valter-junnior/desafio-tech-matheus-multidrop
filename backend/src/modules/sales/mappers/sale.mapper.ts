import { Sale, Product, User } from '@prisma/client';
import { SaleEntity } from '../entities/sale.entity';
import { ProductMapper } from '../../products/mappers/product.mapper';
import { UserMapper } from '../../users/mappers/user.mapper';

type SaleWithRelations = Sale & {
  product?: Product;
  customer?: User;
  partner?: User;
};

export class SaleMapper {
  static toDomain(prismaSale: SaleWithRelations): SaleEntity {
    return new SaleEntity(
      prismaSale.id,
      prismaSale.value,
      prismaSale.productId,
      prismaSale.customerId,
      prismaSale.partnerId,
      prismaSale.createdAt,
      prismaSale.product ? ProductMapper.toDomain(prismaSale.product) : undefined,
      prismaSale.customer ? UserMapper.toDomain(prismaSale.customer) : undefined,
      prismaSale.partner ? UserMapper.toDomain(prismaSale.partner) : undefined,
    );
  }

  static toPrisma(entity: SaleEntity): Omit<Sale, 'id' | 'createdAt'> {
    return {
      value: entity.value,
      productId: entity.productId,
      customerId: entity.customerId,
      partnerId: entity.partnerId,
    };
  }

  static toDomainArray(prismaSales: SaleWithRelations[]): SaleEntity[] {
    return prismaSales.map((sale) => this.toDomain(sale));
  }
}
