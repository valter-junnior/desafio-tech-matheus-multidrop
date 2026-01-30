import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUser, useUpdateUser, useUser } from "../hooks/use-users";
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
import { UserRole } from "../../../app/config/constants";
import { useEffect } from "react";

const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum([UserRole.ADMIN, UserRole.PARTNER, UserRole.CUSTOMER], {
    message: "Perfil inválido",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: user } = useUser(id || "");
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: UserRole.CUSTOMER,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role as UserRole);
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && id) {
        await updateUser.mutateAsync({ id, data });
      } else {
        await createUser.mutateAsync(data);
      }
      navigate("/users");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
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
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="h-10"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Perfil
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setValue("role", value as UserRole)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                  <SelectItem value={UserRole.CUSTOMER}>Cliente</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1.5">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/users")}
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
