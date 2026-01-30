import type { SaleEntity } from '../../entities/sale.entity';
import type { CreateSaleDto } from '../../dto/create-sale.dto';

/**
 * Interface abstrata do repositório de vendas
 * Define o contrato que a camada de infraestrutura deve implementar
 * Segue o princípio de Inversão de Dependência (DIP)
 */
export interface ISaleRepository {
  create(data: CreateSaleDto): Promise<SaleEntity>;
  findAll(skip?: number, take?: number): Promise<SaleEntity[]>;
  findById(id: number): Promise<SaleEntity | null>;
  findByPartner(partnerId: number): Promise<SaleEntity[]>;
  count(): Promise<number>;
}

/**
 * Token de injeção de dependência para o repository
 */
export const SALE_REPOSITORY = Symbol('ISaleRepository');
