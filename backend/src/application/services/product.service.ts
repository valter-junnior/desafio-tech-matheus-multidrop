import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateProductDto } from '../dtos/product/create-product.dto';
import type { IProductRepository } from '../../core/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../core/repositories/product.repository';
import { ProductEntity } from '../../core/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productRepository.create(createProductDto);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.productRepository.findAll(skip, limit),
      this.productRepository.count(),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return product;
  }
}
