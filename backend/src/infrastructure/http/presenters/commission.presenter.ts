import { ApiProperty } from '@nestjs/swagger';
import { CommissionResponseDto } from '../../../application/dtos/commission-response.dto';

export class CommissionPresenter {
  @ApiProperty({ description: 'ID do parceiro', example: 3 })
  partnerId: number;

  @ApiProperty({ description: 'Nome do parceiro', example: 'João Silva' })
  partnerName: string;

  @ApiProperty({ description: 'Total de vendas realizadas', example: 5 })
  totalSales: number;

  @ApiProperty({ description: 'Valor total das vendas', example: 7500.00 })
  totalValue: number;

  @ApiProperty({ description: 'Total de comissão (10%)', example: 750.00 })
  totalCommission: number;

  @ApiProperty({ description: 'Taxa de comissão', example: 0.10 })
  commissionRate: number;

  static fromDto(dto: CommissionResponseDto): CommissionPresenter {
    const presenter = new CommissionPresenter();
    presenter.partnerId = dto.partnerId;
    presenter.partnerName = dto.partnerName;
    presenter.totalSales = dto.totalSales;
    presenter.totalValue = dto.totalValue;
    presenter.totalCommission = dto.totalCommission;
    presenter.commissionRate = dto.commissionRate;
    return presenter;
  }
}
