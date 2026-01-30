import { ProductEntity } from 'src/core/entities/product.entity';
import {
  ProductPersistence,
  CreateProductPersistence,
} from './product-persistence.type';

export class ProductMapper {

  static toDomain(persistence: ProductPersistence): ProductEntity {
    return new ProductEntity(
      persistence.id,
      persistence.name,
      persistence.price,
      persistence.active,
      persistence.createdAt,
    );
  }

  static toPersistence(entity: ProductEntity): CreateProductPersistence {
    return {
      name: entity.name,
      price: entity.price,
      active: entity.active,
    };
  }

  static toDomainArray(persistenceArray: ProductPersistence[]): ProductEntity[] {
    return persistenceArray.map((persistence) => this.toDomain(persistence));
  }
}
