import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/hooks/use-auth-store";
import { Button } from "../shared/components/ui/button";
import { Users, Package, ShoppingCart, BarChart3, LogOut } from "lucide-react";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const allNavigation = [
    /* { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "PARTNER", "CUSTOMER"] }, */
    { name: "Usuários", href: "/users", icon: Users, roles: ["ADMIN"] },
    {
      name: "Produtos",
      href: "/products",
      icon: Package,
      roles: ["ADMIN", "PARTNER", "CUSTOMER"],
    },
    {
      name: "Vendas",
      href: "/sales",
      icon: ShoppingCart,
      roles: ["ADMIN", "PARTNER"],
    },
    {
      name: "Relatórios",
      href: "/reports",
      icon: BarChart3,
      roles: ["ADMIN", "PARTNER"],
      subItems: [
        { name: "Vendas", href: "/reports/sales", roles: ["ADMIN"] },
        {
          name: "Comissões",
          href: "/reports/commissions",
          roles: ["ADMIN", "PARTNER"],
        },
      ],
    },
  ];

  // Filtrar navegação baseado na role do usuário
  const navigation = allNavigation
    .filter((item) => !item.roles || item.roles.includes(user?.role || ""))
    .map((item) => {
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(
          (subItem) =>
            !subItem.roles || subItem.roles.includes(user?.role || ""),
        );

        return {
          ...item,
          href:
            filteredSubItems.length > 0 ? filteredSubItems[0].href : item.href,
          subItems: filteredSubItems,
        };
      }
      return item;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-gray-800">Multidrop</h1>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <p className="text-sm font-medium text-gray-800">{user?.email}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname.startsWith(item.href + "/");

              return (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>

                  {item.subItems && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isSubActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
