import { apiClient } from "./api";

export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

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

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response =
      await apiClient.get<PaginatedResponse<Product>>("/products");
    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
