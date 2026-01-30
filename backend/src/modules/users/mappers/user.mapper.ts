import { UserEntity } from '../entities/user.entity';
import {
  UserPersistence,
  CreateUserPersistence,
} from '../infrastructure/types/user-persistence.type';

/**
 * Mapper para conversão entre camada de domínio e persistência
 * Isola a lógica de transformação e garante que a camada de domínio
 * não dependa diretamente do Prisma
 */
export class UserMapper {
  /**
   * Converte dados de persistência para entidade de domínio
   */
  static toDomain(persistence: UserPersistence): UserEntity {
    return new UserEntity(
      persistence.id,
      persistence.name,
      persistence.email,
      persistence.role,
      persistence.createdAt,
    );
  }

  /**
   * Converte entidade de domínio para dados de persistência
   */
  static toPersistence(entity: UserEntity): CreateUserPersistence {
    return {
      name: entity.name,
      email: entity.email,
      role: entity.role,
    };
  }

  /**
   * Converte array de dados de persistência para array de entidades de domínio
   */
  static toDomainArray(persistenceArray: UserPersistence[]): UserEntity[] {
    return persistenceArray.map((persistence) => this.toDomain(persistence));
  }
}
