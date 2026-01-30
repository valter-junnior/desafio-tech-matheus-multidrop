import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma/client';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({ 
    description: 'Email único do usuário',
    example: 'joao@example.com'
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({ 
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.CUSTOMER
  })
  @IsEnum(UserRole, { message: 'Role deve ser ADMIN, PARTNER ou CUSTOMER' })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: UserRole;
}
