import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../core/enums/user-role.enum';

/**
 * Request DTO para criação de usuário - Camada de infraestrutura HTTP
 * Usado nos controllers com validação
 */
export class CreateUserRequest {
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
