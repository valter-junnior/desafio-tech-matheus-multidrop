import type { ProductEntity } from '../entities/product.entity';
import type { CreateProductDto } from '../../application/dtos/product/create-product.dto';

export interface IProductRepository {
  create(data: CreateProductDto): Promise<ProductEntity>;
  findAll(skip?: number, take?: number): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity | null>;
  count(): Promise<number>;
}

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
