import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { CommissionResponseDto } from './dto/commission-response.dto';

@ApiTags('partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get(':id/commissions')
  @ApiOperation({ summary: 'Buscar comissões de um parceiro' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do parceiro' })
  @ApiResponse({ status: 200, description: 'Comissões encontradas', type: CommissionResponseDto })
  @ApiResponse({ status: 404, description: 'Parceiro não encontrado' })
  async getCommissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommissionResponseDto> {
    return this.partnerService.getCommissions(id);
  }
}
