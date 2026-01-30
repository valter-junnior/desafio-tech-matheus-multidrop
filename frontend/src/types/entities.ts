export type UserRole = "ADMIN" | "PARTNER" | "CUSTOMER";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  commission?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: number;
  productId: number;
  partnerId: number;
  customerId: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  partner?: User;
  customer?: User;
}
