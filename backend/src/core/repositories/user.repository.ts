import type { UserEntity } from '../entities/user.entity';
import type { CreateUserDto } from '../../application/dtos/user/create-user.dto';
import { UserRole } from '../enums/user-role.enum';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<UserEntity>;
  findAll(skip?: number, take?: number, role?: UserRole): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  count(role?: UserRole): Promise<number>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
