import { ProductEntity } from '../entities/product.entity';
import {
  ProductPersistence,
  CreateProductPersistence,
} from '../infrastructure/types/product-persistence.type';

/**
 * Mapper para conversão entre camada de domínio e persistência
 * Isola a lógica de transformação e garante que a camada de domínio
 * não dependa diretamente do Prisma
 */
export class ProductMapper {
  /**
   * Converte dados de persistência para entidade de domínio
   */
  static toDomain(persistence: ProductPersistence): ProductEntity {
    return new ProductEntity(
      persistence.id,
      persistence.name,
      persistence.price,
      persistence.active,
      persistence.createdAt,
    );
  }

  /**
   * Converte entidade de domínio para dados de persistência
   */
  static toPersistence(entity: ProductEntity): CreateProductPersistence {
    return {
      name: entity.name,
      price: entity.price,
      active: entity.active,
    };
  }

  /**
   * Converte array de dados de persistência para array de entidades de domínio
   */
  static toDomainArray(persistenceArray: ProductPersistence[]): ProductEntity[] {
    return persistenceArray.map((persistence) => this.toDomain(persistence));
  }
}
