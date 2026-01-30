import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryPrisma } from './infrastructure/user-repository.prisma';
import { USER_REPOSITORY } from './domain/interfaces/user-repository.interface';

/**
 * Módulo de usuários
 * Configura a injeção de dependência usando o padrão de interface
 * A implementação concreta (Prisma) pode ser facilmente substituída
 */
@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryPrisma,
    },
  ],
  exports: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryPrisma,
    },
  ],
})
export class UserModule {}
