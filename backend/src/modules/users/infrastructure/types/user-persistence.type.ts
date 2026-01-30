import { UserRole } from '../../domain/enums/user-role.enum';

/**
 * Tipo de persistência para User
 * Representa a estrutura de dados vinda do banco de dados
 * Desacopla as entidades de domínio dos tipos do Prisma
 */
export interface UserPersistence {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Tipo para criação de usuário na persistência
 */
export type CreateUserPersistence = Omit<UserPersistence, 'id' | 'createdAt'>;
