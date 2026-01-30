import type { UserEntity } from '../../entities/user.entity';
import type { CreateUserDto } from '../../dto/create-user.dto';

/**
 * Interface abstrata do repositório de usuários
 * Define o contrato que a camada de infraestrutura deve implementar
 * Segue o princípio de Inversão de Dependência (DIP)
 */
export interface IUserRepository {
  create(data: CreateUserDto): Promise<UserEntity>;
  findAll(skip?: number, take?: number): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  count(): Promise<number>;
}

/**
 * Token de injeção de dependência para o repository
 */
export const USER_REPOSITORY = Symbol('IUserRepository');
