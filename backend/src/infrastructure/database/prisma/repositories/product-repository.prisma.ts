import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductEntity } from '../../../../core/entities/product.entity';
import { IProductRepository } from '../../../../core/repositories/product.repository';
import { CreateProductDto } from 'src/application/dtos/product/create-product.dto';
import { ProductPersistence } from '../models/product/product-persistence.type';
import { Product } from '../prisma';
import { ProductMapper } from '../models/product/product.mapper';

@Injectable()
export class ProductRepositoryPrisma implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data,
    });
    return ProductMapper.toDomain(this.mapPrismaToPersistence(product));
  }

  async findAll(skip: number = 0, take: number = 10): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ProductMapper.toDomainArray(
      products.map((product) => this.mapPrismaToPersistence(product)),
    );
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product
      ? ProductMapper.toDomain(this.mapPrismaToPersistence(product))
      : null;
  }

  async count(): Promise<number> {
    return this.prisma.product.count();
  }

  private mapPrismaToPersistence(prismaProduct: Product): ProductPersistence {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      price: prismaProduct.price,
      active: prismaProduct.active,
      createdAt: prismaProduct.createdAt,
    };
  }
}
