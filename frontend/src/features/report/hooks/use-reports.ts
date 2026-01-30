import { useQuery } from "@tanstack/react-query";
import { reportService } from "../../../app/services/report.service";

export function useSalesReport() {
  return useQuery({
    queryKey: ["reports", "sales"],
    queryFn: reportService.getSalesReport,
  });
}

export function useCommissionsReport() {
  return useQuery({
    queryKey: ["reports", "commissions"],
    queryFn: reportService.getCommissions,
  });
}

export function usePartnerCommissions(partnerId: number) {
  return useQuery({
    queryKey: ["reports", "partner-commissions", partnerId],
    queryFn: () => reportService.getPartnerCommissions(partnerId),
    enabled: !!partnerId,
  });
}
