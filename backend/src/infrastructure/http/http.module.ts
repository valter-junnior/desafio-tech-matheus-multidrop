import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ProductController } from './controllers/product.controller';
import { UserController } from './controllers/user.controller';
import { SaleController } from './controllers/sale.controller';
import { PartnerController } from './controllers/partner.controller';
import { ReportController } from './controllers/report.controller';

@Module({
  controllers: [
    AppController,
    ProductController,
    UserController,
    SaleController,
    PartnerController,
    ReportController,
  ],
})
export class HttpModule {}
