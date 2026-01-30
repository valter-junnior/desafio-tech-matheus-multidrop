import { UserEntity } from '../../../../../core/entities/user.entity';
import {
  UserPersistence,
  CreateUserPersistence,
} from './user-persistence.type';

export class UserMapper {

  static toDomain(persistence: UserPersistence): UserEntity {
    return new UserEntity(
      persistence.id,
      persistence.name,
      persistence.email,
      persistence.role,
      persistence.createdAt,
    );
  }

  static toPersistence(entity: UserEntity): CreateUserPersistence {
    return {
      name: entity.name,
      email: entity.email,
      role: entity.role,
    };
  }

  static toDomainArray(persistenceArray: UserPersistence[]): UserEntity[] {
    return persistenceArray.map((persistence) => this.toDomain(persistence));
  }
}
