import type { UserRole } from "./entities";

// User DTOs
export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
}

// Product DTOs
export interface CreateProductDto {
  name: string;
  price: number;
  active: boolean;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  active?: boolean;
}

// Sale DTOs
export interface CreateSaleDto {
  productId: number;
  partnerId: number;
  customerId: number;
  quantity: number;
}

// Auth DTOs
export interface GenerateTokenDto {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  payload: {
    sub: string;
    email: string;
    role: string;
  };
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
