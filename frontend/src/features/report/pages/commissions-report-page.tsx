import { useState } from "react";
import { usePartnerCommissions } from "../hooks/use-reports";
import { useUsers } from "../../user/hooks/use-users";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/components/ui/select";

export function CommissionsReportPage() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(
    null,
  );
  const { data: partners, isLoading: isLoadingUsers } = useUsers("PARTNER");
  const {
    data: commissionReport,
    isLoading,
    error,
  } = usePartnerCommissions(selectedPartnerId!);

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Carregando parceiros...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Relatório de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Selecione um Parceiro
              </label>
              <Select
                value={selectedPartnerId?.toString() || ""}
                onValueChange={(value) => setSelectedPartnerId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha um parceiro" />
                </SelectTrigger>
                <SelectContent>
                  {partners?.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedPartnerId && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Selecione um parceiro para visualizar suas comissões
            </p>
          </CardContent>
        </Card>
      )}

      {selectedPartnerId && isLoading && (
        <div className="flex items-center justify-center h-96">
          <p>Carregando comissões...</p>
        </div>
      )}

      {selectedPartnerId && error && (
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Erro ao carregar comissões do parceiro</p>
        </div>
      )}

      {selectedPartnerId && !isLoading && !error && commissionReport && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {commissionReport.partnerName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Total de vendas: {commissionReport.totalSales}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(commissionReport.totalValue)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Comissão Total</p>
                    <p className="text-3xl font-bold text-green-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(commissionReport.totalCommission)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Taxa de Comissão</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(commissionReport.commissionRate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
