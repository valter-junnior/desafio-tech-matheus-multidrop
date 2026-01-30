import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PartnerService } from '../../../application/services/partner.service';
import { CommissionPresenter } from '../presenters/commission.presenter';

@ApiTags('partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get(':id/commissions')
  @ApiOperation({ summary: 'Buscar comissões de um parceiro' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do parceiro' })
  @ApiResponse({ status: 200, description: 'Comissões encontradas', type: CommissionPresenter })
  @ApiResponse({ status: 404, description: 'Parceiro não encontrado' })
  async getCommissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommissionPresenter> {
    const dto = await this.partnerService.getCommissions(id);
    return CommissionPresenter.fromDto(dto);
  }
}
