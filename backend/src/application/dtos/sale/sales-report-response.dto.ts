export interface SalesReportQuery {
  startDate?: string;
  endDate?: string;
  partnerId?: number;
}

export class SalesReportResponseDto {
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
    createdAt: Date;
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

  constructor(partial: Partial<SalesReportResponseDto>) {
    Object.assign(this, partial);
  }
}
