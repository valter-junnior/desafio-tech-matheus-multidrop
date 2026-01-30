import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { IUserRepository } from '../domain/interfaces/user-repository.interface';
import { User } from 'src/generated/prisma/client';
import { UserPersistence } from './types/user-persistence.type';

/**
 * Implementação do repositório de usuários usando Prisma
 * Camada de infraestrutura - Implementa a interface da camada de domínio
 * Segue o princípio de Inversão de Dependência (DIP)
 */
@Injectable()
export class UserRepositoryPrisma implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data,
    });
    return UserMapper.toDomain(this.mapPrismaToPersistence(user));
  }

  async findAll(skip: number = 0, take: number = 10): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return UserMapper.toDomainArray(
      users.map((user) => this.mapPrismaToPersistence(user)),
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toDomain(this.mapPrismaToPersistence(user)) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toDomain(this.mapPrismaToPersistence(user)) : null;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  /**
   * Converte tipos do Prisma para tipos de persistência intermediários
   * Mantém o Prisma isolado nesta camada de infraestrutura
   */
  private mapPrismaToPersistence(prismaUser: User): UserPersistence {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role as any, // O enum do Prisma é compatível com nosso enum
      createdAt: prismaUser.createdAt,
    };
  }
}
