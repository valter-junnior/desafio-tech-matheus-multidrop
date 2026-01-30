import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleRepositoryPrisma } from './infrastructure/sale-repository.prisma';
import { SALE_REPOSITORY } from './domain/interfaces/sale-repository.interface';
import { UserModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';

/**
 * Módulo de vendas
 * Configura a injeção de dependência usando o padrão de interface
 * A implementação concreta (Prisma) pode ser facilmente substituída
 */
@Module({
  imports: [UserModule, ProductModule],
  controllers: [SaleController],
  providers: [
    SaleService,
    {
      provide: SALE_REPOSITORY,
      useClass: SaleRepositoryPrisma,
    },
  ],
  exports: [
    SaleService,
    {
      provide: SALE_REPOSITORY,
      useClass: SaleRepositoryPrisma,
    },
  ],
})
export class SaleModule {}
