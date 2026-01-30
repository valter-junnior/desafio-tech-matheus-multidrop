import { UserRole } from '../../../core/enums/user-role.enum';

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
}
