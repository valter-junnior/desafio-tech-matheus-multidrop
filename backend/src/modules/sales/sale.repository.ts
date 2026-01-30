import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from '@prisma/client';

@Injectable()
export class SaleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSaleDto): Promise<Sale> {
    return this.prisma.sale.create({
      data,
    });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<Sale[]> {
    return this.prisma.sale.findMany({
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
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Sale | null> {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
        partner: true,
      },
    });
  }

  async findByPartner(partnerId: number): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: { partnerId },
      include: {
        product: true,
        customer: true,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.sale.count();
  }
}
