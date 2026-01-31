import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/hooks/use-auth-store";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redireciona para a página inicial baseado na role
    if (user?.role === "ADMIN") {
      return <Navigate to="/users" replace />;
    }
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
}
