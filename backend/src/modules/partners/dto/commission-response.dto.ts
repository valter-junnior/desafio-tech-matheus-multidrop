export class CommissionResponseDto {
  partnerId: number;
  partnerName: string;
  totalSales: number;
  totalValue: number;
  totalCommission: number;
  commissionRate: number;

  constructor(partial: Partial<CommissionResponseDto>) {
    Object.assign(this, partial);
  }
}
