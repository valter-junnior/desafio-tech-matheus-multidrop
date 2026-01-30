import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data,
    });
    return ProductMapper.toDomain(product);
  }

  async findAll(skip: number = 0, take: number = 10): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ProductMapper.toDomainArray(products);
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async count(): Promise<number> {
    return this.prisma.product.count();
  }
}
