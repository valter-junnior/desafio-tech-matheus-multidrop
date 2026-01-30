import { Product } from '@prisma/client';
import { ProductEntity } from '../entities/product.entity';

export class ProductMapper {
  static toDomain(prismaProduct: Product): ProductEntity {
    return new ProductEntity(
      prismaProduct.id,
      prismaProduct.name,
      prismaProduct.price,
      prismaProduct.active,
      prismaProduct.createdAt,
    );
  }

  static toPrisma(entity: ProductEntity): Omit<Product, 'id' | 'createdAt'> {
    return {
      name: entity.name,
      price: entity.price,
      active: entity.active,
    };
  }

  static toDomainArray(prismaProducts: Product[]): ProductEntity[] {
    return prismaProducts.map((product) => this.toDomain(product));
  }
}
