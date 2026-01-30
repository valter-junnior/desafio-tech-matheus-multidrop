/**
 * Tipo de persistência para Product
 * Representa a estrutura de dados vinda do banco de dados
 * Desacopla as entidades de domínio dos tipos do Prisma
 */
export interface ProductPersistence {
  id: number;
  name: string;
  price: number;
  active: boolean;
  createdAt: Date;
}

/**
 * Tipo para criação de produto na persistência
 */
export type CreateProductPersistence = Omit<ProductPersistence, 'id' | 'createdAt'>;
