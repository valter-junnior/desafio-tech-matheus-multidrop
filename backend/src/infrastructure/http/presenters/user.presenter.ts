import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../core/enums/user-role.enum';
import { UserEntity } from '../../../core/entities/user.entity';

/**
 * Presenter para resposta de usuário - Camada de infraestrutura HTTP
 * Usado nos controllers para formatar a resposta
 */
export class UserPresenter {
  @ApiProperty({ description: 'ID do usuário', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
  email: string;

  @ApiProperty({ description: 'Papel do usuário', enum: UserRole, example: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  constructor(partial: Partial<UserPresenter> | UserEntity) {
    if (partial instanceof UserEntity) {
      Object.assign(this, partial.toObject());
    } else {
      Object.assign(this, partial);
    }
  }
}
