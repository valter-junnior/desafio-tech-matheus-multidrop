import { useNavigate } from "react-router-dom";
import { useSales, useDeleteSale } from "../hooks/use-sales";
import { Button } from "../../../shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Trash2, Plus } from "lucide-react";

export function SalesListPage() {
  const navigate = useNavigate();
  const { data: sales, isLoading, error } = useSales();
  const deleteSale = useDeleteSale();

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await deleteSale.mutateAsync(id);
      } catch (error) {
        console.error("Erro ao excluir venda:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Erro ao carregar vendas</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendas</CardTitle>
            <Button onClick={() => navigate("/sales/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Parceiro</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales?.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.product?.name || "N/A"}
                  </TableCell>
                  <TableCell>{sale.partner?.name || "N/A"}</TableCell>
                  <TableCell>{sale.customer?.name || "N/A"}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(sale.totalPrice)}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sale.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
