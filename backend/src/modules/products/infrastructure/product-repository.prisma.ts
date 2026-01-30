import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { IProductRepository } from '../domain/interfaces/product-repository.interface';
import { Product } from 'src/generated/prisma/client';
import { ProductPersistence } from './types/product-persistence.type';

/**
 * Implementação do repositório de produtos usando Prisma
 * Camada de infraestrutura - Implementa a interface da camada de domínio
 * Segue o princípio de Inversão de Dependência (DIP)
 */
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

  /**
   * Converte tipos do Prisma para tipos de persistência intermediários
   * Mantém o Prisma isolado nesta camada de infraestrutura
   */
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
