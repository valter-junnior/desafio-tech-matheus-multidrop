import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
} from "../hooks/use-products";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { useEffect } from "react";

const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que 0"),
  commission: z.coerce
    .number()
    .min(0, "Comissão não pode ser negativa")
    .max(100, "Comissão não pode ser maior que 100"),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: product } = useProduct(id || "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      commission: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("commission", product.commission);
    }
  }, [product, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && id) {
        await updateProduct.mutateAsync({ id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      navigate("/products");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome
              </Label>
              <Input id="name" {...register("name")} className="h-10" />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="h-10"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission" className="text-sm font-medium">
                Comissão (%)
              </Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                {...register("commission", { valueAsNumber: true })}
                className="h-10"
              />
              {errors.commission && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.commission.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
                className="min-w-[100px]"
              >
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[100px]">
                {isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
