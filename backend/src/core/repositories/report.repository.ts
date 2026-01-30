import { SaleEntity } from '../entities/sale.entity';

export interface SalesReportFilters {
  startDate?: Date;
  endDate?: Date;
  partnerId?: number;
}

export interface SalesReportResult {
  sales: SaleEntity[];
  totalSales: number;
  totalValue: number;
}

export interface IReportRepository {
  getSalesReport(filters: SalesReportFilters): Promise<SalesReportResult>;
}

export const REPORT_REPOSITORY = Symbol('IReportRepository');
