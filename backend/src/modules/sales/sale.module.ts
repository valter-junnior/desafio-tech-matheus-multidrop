import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleRepository } from './sale.repository';
import { UserModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [SaleController],
  providers: [SaleService, SaleRepository],
  exports: [SaleService, SaleRepository],
})
export class SaleModule {}
