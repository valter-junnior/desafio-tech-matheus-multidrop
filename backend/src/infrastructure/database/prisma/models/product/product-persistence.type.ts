export interface ProductPersistence {
  id: number;
  name: string;
  price: number;
  active: boolean;
  createdAt: Date;
}

export type CreateProductPersistence = Omit<ProductPersistence, 'id' | 'createdAt'>;
