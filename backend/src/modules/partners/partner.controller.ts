import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CommissionResponseDto } from './dto/commission-response.dto';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get(':id/commissions')
  async getCommissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommissionResponseDto> {
    return this.partnerService.getCommissions(id);
  }
}
