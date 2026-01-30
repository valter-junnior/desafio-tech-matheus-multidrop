import type { ProductEntity } from '../../entities/product.entity';
import type { CreateProductDto } from '../../dto/create-product.dto';

/**
 * Interface abstrata do repositório de produtos
 * Define o contrato que a camada de infraestrutura deve implementar
 * Segue o princípio de Inversão de Dependência (DIP)
 */
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
