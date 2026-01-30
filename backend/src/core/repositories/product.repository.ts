import type { ProductEntity } from '../../modules/products/entities/product.entity';
import type { CreateProductDto } from '../../modules/products/dto/create-product.dto';

export interface IProductRepository {
  create(data: CreateProductDto): Promise<ProductEntity>;
  findAll(skip?: number, take?: number): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity | null>;
  count(): Promise<number>;
}

/**
 * Token de injeção de dependência para o repository
 */
export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
