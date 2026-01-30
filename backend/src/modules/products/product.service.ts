import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import type { IProductRepository } from './domain/interfaces/product-repository.interface';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product-repository.interface';

/**
 * Service de produtos - Camada de aplicação
 * Orquestra as operações usando a interface do repositório
 * Não depende de implementações concretas (DIP)
 */
@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(createProductDto);
    return new ProductResponseDto(product);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: ProductResponseDto[];
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
      data: products.map((product) => new ProductResponseDto(product)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return new ProductResponseDto(product);
  }
}
