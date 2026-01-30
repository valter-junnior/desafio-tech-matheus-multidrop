import { User } from 'generated/prisma/client';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(prismaUser: User): UserEntity {
    return new UserEntity(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.role,
      prismaUser.createdAt,
    );
  }

  static toPrisma(entity: UserEntity): Omit<User, 'id' | 'createdAt'> {
    return {
      name: entity.name,
      email: entity.email,
      role: entity.role,
    };
  }

  static toDomainArray(prismaUsers: User[]): UserEntity[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }
}
