import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserEntity } from '../../../../core/entities/user.entity';
import { UserMapper } from '../models/user/user.mapper';
import { IUserRepository } from '../../../../core/repositories/user.repository';
import { UserPersistence } from '../models/user/user-persistence.type';
import { CreateUserDto } from '../../../../application/dtos/user/create-user.dto';
import { User } from '../prisma';

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

  private mapPrismaToPersistence(prismaUser: User): UserPersistence {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role as any,
      createdAt: prismaUser.createdAt,
    };
  }
}
