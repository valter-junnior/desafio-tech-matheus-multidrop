import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/hooks/use-auth-store";

export function RoleBasedRedirect() {
  const { user } = useAuthStore();

  // ADMIN -> Usuários
  // PARTNER -> Produtos
  // CUSTOMER -> Produtos
  if (user?.role === "ADMIN") {
    return <Navigate to="/users" replace />;
  }

  return <Navigate to="/products" replace />;
}
