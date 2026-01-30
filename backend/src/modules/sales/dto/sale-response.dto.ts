export class SaleResponseDto {
  id: number;
  productId: number;
  customerId: number;
  partnerId: number;
  value: number;
  createdAt: Date;

  constructor(partial: Partial<SaleResponseDto>) {
    Object.assign(this, partial);
  }
}

export class SaleDetailResponseDto extends SaleResponseDto {
  product?: {
    id: number;
    name: string;
    price: number;
  };
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  partner?: {
    id: number;
    name: string;
    email: string;
  };

  constructor(partial: Partial<SaleDetailResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
