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
    createdAt: Date;
    product: {
      id: number;
      name: string;
      price: number;
    };
    customer: {
      id: number;
      name: string;
      email: string;
    };
    partner: {
      id: number;
      name: string;
      email: string;
    };
  }>;

  constructor(partial: Partial<SalesReportResponseDto>) {
    Object.assign(this, partial);
  }
}
