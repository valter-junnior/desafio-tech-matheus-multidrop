import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useCreateSale } from "../hooks/use-sales";
import { useProducts } from "../../product/hooks/use-products";
import { useUsers } from "../../user/hooks/use-users";
import { useErrorHandler } from "../../../shared/hooks/useErrorHandler";
import { useCurrencyFormatter } from "../../../shared/hooks/useCurrencyFormatter";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";

const saleSchema = z.object({
  productId: z.number().min(1, "Produto é obrigatório"),
  partnerId: z.number().min(1, "Parceiro é obrigatório"),
  customerId: z.number().min(1, "Cliente é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
});

type SaleFormData = z.infer<typeof saleSchema>;

export function SaleFormPage() {
  const navigate = useNavigate();
  const createSale = useCreateSale();
  const { data: products } = useProducts();
  const { data: partners } = useUsers("PARTNER");
  const { data: customers } = useUsers("CUSTOMER");
  const { handleError, handleSuccess } = useErrorHandler();
  const currencyFormatter = useCurrencyFormatter();

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(
    null,
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    mode: "onChange",
  });

  // Memoizar formatação de produtos
  const formattedProducts = useMemo(
    () =>
      products?.map((product) => ({
        ...product,
        formattedPrice: currencyFormatter.format(product.price),
      })),
    [products, currencyFormatter],
  );

  const onSubmit = async (data: SaleFormData) => {
    // Validar selects manualmente
    if (!selectedProductId) {
      setError("productId", { message: "Produto é obrigatório" });
      return;
    }
    if (!selectedPartnerId) {
      setError("partnerId", { message: "Parceiro é obrigatório" });
      return;
    }
    if (!selectedCustomerId) {
      setError("customerId", { message: "Cliente é obrigatório" });
      return;
    }

    try {
      await createSale.mutateAsync({
        productId: selectedProductId,
        partnerId: selectedPartnerId,
        customerId: selectedCustomerId,
        quantity: data.quantity,
      });
      handleSuccess("Venda criada com sucesso!");
      navigate("/sales");
    } catch (error) {
      handleError(error, "Erro ao criar venda");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Nova Venda</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-sm font-medium">
                Produto
              </Label>
              <Select
                value={selectedProductId?.toString() || ""}
                onValueChange={(value) => {
                  setSelectedProductId(Number(value));
                  clearErrors("productId");
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {formattedProducts?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - {product.formattedPrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productId && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.productId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerId" className="text-sm font-medium">
                Parceiro
              </Label>
              <Select
                value={selectedPartnerId?.toString() || ""}
                onValueChange={(value) => {
                  setSelectedPartnerId(Number(value));
                  clearErrors("partnerId");
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um parceiro" />
                </SelectTrigger>
                <SelectContent>
                  {partners?.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.name} ({partner.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.partnerId && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.partnerId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId" className="text-sm font-medium">
                Cliente
              </Label>
              <Select
                value={selectedCustomerId?.toString() || ""}
                onValueChange={(value) => {
                  setSelectedCustomerId(Number(value));
                  clearErrors("customerId");
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register("quantity", { valueAsNumber: true })}
                className="h-10"
              />
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/sales")}
                className="min-w-[100px]"
                disabled={createSale.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="min-w-[100px]"
                disabled={createSale.isPending}
              >
                {createSale.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Venda"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
