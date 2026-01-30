import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CommissionResponseDto } from '../dtos/commission-response.dto';
import { UserRole } from '../../core/enums/user-role.enum';
import type { IUserRepository } from '../../core/repositories/user.repository';
import { USER_REPOSITORY } from '../../core/repositories/user.repository';
import type { ISaleRepository } from '../../core/repositories/sale.repository';
import { SALE_REPOSITORY } from '../../core/repositories/sale.repository';

@Injectable()
export class PartnerService {
  private readonly COMMISSION_RATE = 0.1; // 10%

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async getCommissions(partnerId: number): Promise<CommissionResponseDto> {
    const partner = await this.userRepository.findById(partnerId);
    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${partnerId} não encontrado`);
    }
    if (partner.role !== UserRole.PARTNER) {
      throw new BadRequestException('O ID fornecido não é de um parceiro');
    }

    const sales = await this.saleRepository.findByPartner(partnerId);

    const totalSales = sales.length;
    const totalValue = sales.reduce((acc, sale) => acc + sale.value, 0);
    const totalCommission = totalValue * this.COMMISSION_RATE;

    return new CommissionResponseDto({
      partnerId: partner.id,
      partnerName: partner.name,
      totalSales,
      totalValue,
      totalCommission,
      commissionRate: this.COMMISSION_RATE,
    });
  }
}
