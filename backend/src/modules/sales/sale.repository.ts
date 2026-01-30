import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleEntity } from './entities/sale.entity';
import { SaleMapper } from './mappers/sale.mapper';

@Injectable()
export class SaleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSaleDto): Promise<SaleEntity> {
    const sale = await this.prisma.sale.create({
      data,
    });
    return SaleMapper.toDomain(sale);
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
    return SaleMapper.toDomainArray(sales);
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
    return sale ? SaleMapper.toDomain(sale) : null;
  }

  async findByPartner(partnerId: number): Promise<SaleEntity[]> {
    const sales = await this.prisma.sale.findMany({
      where: { partnerId },
      include: {
        product: true,
        customer: true,
      },
    });
    return SaleMapper.toDomainArray(sales);
  }

  async count(): Promise<number> {
    return this.prisma.sale.count();
  }
}
