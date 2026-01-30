import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleEntity } from '../entities/sale.entity';
import { SaleMapper } from '../mappers/sale.mapper';
import { ISaleRepository } from '../domain/interfaces/sale-repository.interface';
import { Sale, Product, User } from '../../../infrastructure/database/prisma/generated';
import { SalePersistenceWithRelations } from './types/sale-persistence.type';
import { ProductPersistence } from '../../../infrastructure/database/prisma/models/product/product-persistence.type';
import { UserPersistence } from '../../../infrastructure/database/prisma/models/user/user-persistence.type';

type PrismaSaleWithRelations = Sale & {
  product?: Product;
  customer?: User;
  partner?: User;
};

/**
 * Implementação do repositório de vendas usando Prisma
 * Camada de infraestrutura - Implementa a interface da camada de domínio
 * Segue o princípio de Inversão de Dependência (DIP)
 */
@Injectable()
export class SaleRepositoryPrisma implements ISaleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSaleDto): Promise<SaleEntity> {
    const sale = await this.prisma.sale.create({
      data,
    });
    return SaleMapper.toDomain(this.mapPrismaToPersistence(sale));
  }

  async findAll(skip: number = 0, take: number = 10): Promise<SaleEntity[]> {
    const sales = await this.prisma.sale.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            active: true,
            createdAt: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
    return SaleMapper.toDomainArray(
      sales.map((sale) => this.mapPrismaToPersistence(sale)),
    );
  }

  async findById(id: number): Promise<SaleEntity | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
        partner: true,
      },
    });
    return sale ? SaleMapper.toDomain(this.mapPrismaToPersistence(sale)) : null;
  }

  async findByPartner(partnerId: number): Promise<SaleEntity[]> {
    const sales = await this.prisma.sale.findMany({
      where: { partnerId },
      include: {
        product: true,
        customer: true,
      },
    });
    return SaleMapper.toDomainArray(
      sales.map((sale) => this.mapPrismaToPersistence(sale)),
    );
  }

  async count(): Promise<number> {
    return this.prisma.sale.count();
  }

  /**
   * Converte tipos do Prisma para tipos de persistência intermediários
   * Mantém o Prisma isolado nesta camada de infraestrutura
   */
  private mapPrismaToPersistence(
    prismaSale: PrismaSaleWithRelations,
  ): SalePersistenceWithRelations {
    return {
      id: prismaSale.id,
      value: prismaSale.value,
      productId: prismaSale.productId,
      customerId: prismaSale.customerId,
      partnerId: prismaSale.partnerId,
      createdAt: prismaSale.createdAt,
      product: prismaSale.product
        ? this.mapProductToPersistence(prismaSale.product)
        : undefined,
      customer: prismaSale.customer
        ? this.mapUserToPersistence(prismaSale.customer)
        : undefined,
      partner: prismaSale.partner
        ? this.mapUserToPersistence(prismaSale.partner)
        : undefined,
    };
  }

  private mapProductToPersistence(prismaProduct: Product): ProductPersistence {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      price: prismaProduct.price,
      active: prismaProduct.active,
      createdAt: prismaProduct.createdAt,
    };
  }

  private mapUserToPersistence(prismaUser: User): UserPersistence {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role as any,
      createdAt: prismaUser.createdAt,
    };
  }
}
