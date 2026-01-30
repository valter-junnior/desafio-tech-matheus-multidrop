export class ProductResponseDto {
  id: number;
  name: string;
  price: number;
  active: boolean;
  createdAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
