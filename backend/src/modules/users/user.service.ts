import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { IUserRepository } from './domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from './domain/interfaces/user-repository.interface';

/**
 * Service de usuários - Camada de aplicação
 * Orquestra as operações usando a interface do repositório
 * Não depende de implementações concretas (DIP)
 */
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verifica se email já existe
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = await this.userRepository.create(createUserDto);
    return new UserResponseDto(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.findAll(skip, limit),
      this.userRepository.count(),
    ]);

    return {
      data: users.map((user) => new UserResponseDto(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return new UserResponseDto(user);
  }
}
