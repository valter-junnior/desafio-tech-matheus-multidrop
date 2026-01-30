import { UserRole } from '../../../../../core/enums/user-role.enum';

export interface UserPersistence {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export type CreateUserPersistence = Omit<UserPersistence, 'id' | 'createdAt'>;
