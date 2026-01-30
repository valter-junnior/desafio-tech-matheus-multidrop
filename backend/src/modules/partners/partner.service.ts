import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { SaleRepository } from '../sales/sale.repository';
import { CommissionResponseDto } from './dto/commission-response.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class PartnerService {
  private readonly COMMISSION_RATE = 0.1; // 10%

  constructor(
    private readonly userRepository: UserRepository,
    private readonly saleRepository: SaleRepository,
  ) {}

  async getCommissions(partnerId: number): Promise<CommissionResponseDto> {
    // Validar que o usuário existe e é um parceiro
    const partner = await this.userRepository.findById(partnerId);
    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${partnerId} não encontrado`);
    }
    if (partner.role !== UserRole.PARTNER) {
      throw new BadRequestException('O ID fornecido não é de um parceiro');
    }

    // Buscar vendas do parceiro
    const sales = await this.saleRepository.findByPartner(partnerId);

    // Calcular totais
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
