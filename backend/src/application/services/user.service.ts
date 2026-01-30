import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import type { IUserRepository } from '../../core/repositories/user.repository';
import { USER_REPOSITORY } from '../../core/repositories/user.repository';
import { UserEntity } from '../../core/entities/user.entity';
import { UserRole } from '../../core/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    return await this.userRepository.create(createUserDto);
  }

  async findAll(page: number = 1, limit: number = 10, role?: UserRole): Promise<{
    data: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.findAll(skip, limit, role),
      this.userRepository.count(role),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }
}
