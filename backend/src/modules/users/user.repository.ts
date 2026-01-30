import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data,
    });
    return UserMapper.toDomain(user);
  }

  async findAll(skip: number = 0, take: number = 10): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return UserMapper.toDomainArray(users);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}
