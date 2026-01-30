import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepositoryPrisma } from './infrastructure/product-repository.prisma';
import { PRODUCT_REPOSITORY } from '../../core/repositories/product.repository';

/**
 * Módulo de produtos
 * Configura a injeção de dependência usando o padrão de interface
 * A implementação concreta (Prisma) pode ser facilmente substituída
 */
@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryPrisma,
    },
  ],
  exports: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryPrisma,
    },
  ],
})
export class ProductModule {}
