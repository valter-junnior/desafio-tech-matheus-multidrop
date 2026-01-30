import { SaleEntity } from '../entities/sale.entity';
import {
  SalePersistenceWithRelations,
  CreateSalePersistence,
} from '../infrastructure/types/sale-persistence.type';
import { ProductMapper } from '../../products/mappers/product.mapper';
import { UserMapper } from '../../users/mappers/user.mapper';

/**
 * Mapper para conversão entre camada de domínio e persistência
 * Isola a lógica de transformação e garante que a camada de domínio
 * não dependa diretamente do Prisma
 */
export class SaleMapper {
  /**
   * Converte dados de persistência para entidade de domínio
   */
  static toDomain(persistence: SalePersistenceWithRelations): SaleEntity {
    return new SaleEntity(
      persistence.id,
      persistence.value,
      persistence.productId,
      persistence.customerId,
      persistence.partnerId,
      persistence.createdAt,
      persistence.product ? ProductMapper.toDomain(persistence.product) : undefined,
      persistence.customer ? UserMapper.toDomain(persistence.customer) : undefined,
      persistence.partner ? UserMapper.toDomain(persistence.partner) : undefined,
    );
  }

  /**
   * Converte entidade de domínio para dados de persistência
   */
  static toPersistence(entity: SaleEntity): CreateSalePersistence {
    return {
      value: entity.value,
      productId: entity.productId,
      customerId: entity.customerId,
      partnerId: entity.partnerId,
    };
  }

  /**
   * Converte array de dados de persistência para array de entidades de domínio
   */
  static toDomainArray(persistenceArray: SalePersistenceWithRelations[]): SaleEntity[] {
    return persistenceArray.map((persistence) => this.toDomain(persistence));
  }
}
