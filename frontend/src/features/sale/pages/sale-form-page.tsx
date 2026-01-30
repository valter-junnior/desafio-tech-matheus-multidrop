import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateSale } from "../hooks/use-sales";
import { useProducts } from "../../product/hooks/use-products";
import { useUsers } from "../../user/hooks/use-users";
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
  productId: z.string().min(1, "Produto é obrigatório"),
  partnerId: z.string().min(1, "Parceiro é obrigatório"),
  customerId: z.string().min(1, "Cliente é obrigatório"),
  quantity: z.coerce.number().min(1, "Quantidade deve ser maior que 0"),
});

type SaleFormData = z.infer<typeof saleSchema>;

export function SaleFormPage() {
  const navigate = useNavigate();
  const createSale = useCreateSale();
  const { data: products } = useProducts();
  const { data: users } = useUsers();

  const partners = users?.filter((user) => user.role === "PARTNER");
  const customers = users?.filter((user) => user.role === "CUSTOMER");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: "",
      partnerId: "",
      customerId: "",
      quantity: 1,
    },
    mode: "onChange",
  });

  const selectedProductId = watch("productId");
  const selectedPartnerId = watch("partnerId");
  const selectedCustomerId = watch("customerId");

  const onSubmit = async (data: SaleFormData) => {
    try {
      await createSale.mutateAsync(data);
      navigate("/sales");
    } catch (error) {
      console.error("Erro ao criar venda:", error);
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
                value={selectedProductId}
                onValueChange={(value) => setValue("productId", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} -{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
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
                value={selectedPartnerId}
                onValueChange={(value) => setValue("partnerId", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um parceiro" />
                </SelectTrigger>
                <SelectContent>
                  {partners?.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
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
                value={selectedCustomerId}
                onValueChange={(value) => setValue("customerId", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
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
              >
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[100px]">
                Criar Venda
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
