import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSales, useDeleteSale } from "../hooks/use-sales";
import { useErrorHandler } from "../../../shared/hooks/useErrorHandler";
import { useCurrencyFormatter } from "../../../shared/hooks/useCurrencyFormatter";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../shared/components/ui/alert-dialog";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";

export function SalesListPage() {
  const navigate = useNavigate();
  const { data: sales, isLoading, error, refetch } = useSales();
  const deleteSale = useDeleteSale();
  const { handleError, handleSuccess } = useErrorHandler();
  const currencyFormatter = useCurrencyFormatter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id.toString());
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      await deleteSale.mutateAsync(deleteId);
      handleSuccess("Venda excluída com sucesso!");
      setDeleteId(null);
    } catch (error) {
      handleError(error, "Erro ao excluir venda");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Erro ao carregar vendas.
            <Button
              variant="link"
              onClick={() => refetch()}
              className="ml-2 p-0 h-auto"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
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
                    {currencyFormatter.format(sale.totalPrice)}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(sale.id)}
                      disabled={deleteSale.isPending}
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

      {/* Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSale.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteSale.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteSale.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
