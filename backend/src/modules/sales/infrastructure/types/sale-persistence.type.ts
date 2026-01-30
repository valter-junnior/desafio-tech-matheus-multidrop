import { ProductPersistence } from '../../../../infrastructure/database/prisma/models/product/product-persistence.type';
import { UserPersistence } from '../../../../infrastructure/database/prisma/models/user/user-persistence.type';

/**
 * Tipo de persistência para Sale
 * Representa a estrutura de dados vinda do banco de dados
 * Desacopla as entidades de domínio dos tipos do Prisma
 */
export interface SalePersistence {
  id: number;
  value: number;
  productId: number;
  customerId: number;
  partnerId: number;
  createdAt: Date;
}

/**
 * Tipo de persistência para Sale com relações
 */
export interface SalePersistenceWithRelations extends SalePersistence {
  product?: ProductPersistence;
  customer?: UserPersistence;
  partner?: UserPersistence;
}

/**
 * Tipo para criação de venda na persistência
 */
export type CreateSalePersistence = Omit<SalePersistence, 'id' | 'createdAt'>;
