import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsEnum(UserRole, { message: 'Role deve ser ADMIN, PARTNER ou CUSTOMER' })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: UserRole;
}
