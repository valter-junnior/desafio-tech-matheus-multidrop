import { apiClient } from "./api";

export interface SalesReportResponse {
  totalSales: number;
  totalValue: number;
  filters: {
    startDate?: string;
    endDate?: string;
    partnerId?: number;
  };
  sales: Array<{
    id: number;
    value: number;
    quantity: number;
    createdAt: string;
    product: {
      id: number;
      name: string;
    };
    customer: {
      id: number;
      name: string;
    };
    partner: {
      id: number;
      name: string;
    };
  }>;
}

export interface CommissionReport {
  partnerId: number;
  partnerName: string;
  totalSales: number;
  totalValue: number;
  totalCommission: number;
  commissionRate: number;
}

export const reportService = {
  getSalesReport: async (): Promise<SalesReportResponse> => {
    const response = await apiClient.get<SalesReportResponse>("/reports/sales");
    return response.data;
  },

  getCommissions: async (): Promise<CommissionReport[]> => {
    const response = await apiClient.get<CommissionReport[]>(
      "/reports/commissions",
    );
    return response.data;
  },

  getPartnerCommissions: async (
    partnerId: number,
  ): Promise<CommissionReport> => {
    const response = await apiClient.get<CommissionReport>(
      `/partners/${partnerId}/commissions`,
    );
    return response.data;
  },
};
