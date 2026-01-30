import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto, SaleDetailResponseDto } from './dto/sale-response.dto';
import type { ISaleRepository } from './domain/interfaces/sale-repository.interface';
import { SALE_REPOSITORY } from './domain/interfaces/sale-repository.interface';
import type { IUserRepository } from '../../core/repositories/user.repository';
import { USER_REPOSITORY } from '../../core/repositories/user.repository';
import type { IProductRepository } from '../../core/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../core/repositories/product.repository';

/**
 * Service de vendas - Camada de aplicação
 * Orquestra as operações usando as interfaces dos repositórios
 * Não depende de implementações concretas (DIP)
 */
@Injectable()
export class SaleService {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<SaleResponseDto> {
    // Validar produto usando entity
    const product = await this.productRepository.findById(createSaleDto.productId);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${createSaleDto.productId} não encontrado`);
    }
    if (!product.isAvailableForSale()) {
      throw new BadRequestException('Produto não está disponível para venda');
    }

    // Validar customer usando entity
    const customer = await this.userRepository.findById(createSaleDto.customerId);
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${createSaleDto.customerId} não encontrado`);
    }
    if (!customer.isCustomer()) {
      throw new BadRequestException('O customerId deve ser um usuário com role CUSTOMER');
    }

    // Validar partner usando entity
    const partner = await this.userRepository.findById(createSaleDto.partnerId);
    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${createSaleDto.partnerId} não encontrado`);
    }
    if (!partner.isPartner()) {
      throw new BadRequestException('O partnerId deve ser um usuário com role PARTNER');
    }

    const sale = await this.saleRepository.create(createSaleDto);
    return new SaleResponseDto(sale);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: SaleDetailResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [sales, total] = await Promise.all([
      this.saleRepository.findAll(skip, limit),
      this.saleRepository.count(),
    ]);

    return {
      data: sales.map((sale) => new SaleDetailResponseDto(sale)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<SaleDetailResponseDto> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
    return new SaleDetailResponseDto(sale);
  }
}
