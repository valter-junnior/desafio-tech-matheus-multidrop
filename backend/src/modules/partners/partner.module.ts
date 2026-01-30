import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { UserModule } from '../users/user.module';
import { SaleModule } from '../sales/sale.module';

@Module({
  imports: [UserModule, SaleModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
