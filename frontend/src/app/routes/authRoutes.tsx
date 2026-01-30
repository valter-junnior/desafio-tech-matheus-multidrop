import { lazy } from "react";
import { type RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { MainLayout } from "../../layout/main-layout";

const DashboardPage = lazy(() =>
  import("../../shared/components/dashboard-page").then((m) => ({
    default: m.DashboardPage,
  })),
);

const UsersListPage = lazy(() =>
  import("../../features/user/pages/users-list-page").then((m) => ({
    default: m.UsersListPage,
  })),
);

const UserFormPage = lazy(() =>
  import("../../features/user/pages/user-form-page").then((m) => ({
    default: m.UserFormPage,
  })),
);

const ProductsListPage = lazy(() =>
  import("../../features/product/pages/products-list-page").then((m) => ({
    default: m.ProductsListPage,
  })),
);

const ProductFormPage = lazy(() =>
  import("../../features/product/pages/product-form-page").then((m) => ({
    default: m.ProductFormPage,
  })),
);

const SalesListPage = lazy(() =>
  import("../../features/sale/pages/sales-list-page").then((m) => ({
    default: m.SalesListPage,
  })),
);

const SaleFormPage = lazy(() =>
  import("../../features/sale/pages/sale-form-page").then((m) => ({
    default: m.SaleFormPage,
  })),
);

const SalesReportPage = lazy(() =>
  import("../../features/report/pages/sales-report-page").then((m) => ({
    default: m.SalesReportPage,
  })),
);

const CommissionsReportPage = lazy(() =>
  import("../../features/report/pages/commissions-report-page").then((m) => ({
    default: m.CommissionsReportPage,
  })),
);

export const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/users" replace />,
      },
      {
        path: "users",
        element: <UsersListPage />,
      },
      {
        path: "users/new",
        element: <UserFormPage />,
      },
      {
        path: "users/:id/edit",
        element: <UserFormPage />,
      },
      {
        path: "products",
        element: <ProductsListPage />,
      },
      {
        path: "products/new",
        element: <ProductFormPage />,
      },
      {
        path: "products/:id/edit",
        element: <ProductFormPage />,
      },
      {
        path: "sales",
        element: <SalesListPage />,
      },
      {
        path: "sales/new",
        element: <SaleFormPage />,
      },
      {
        path: "reports/sales",
        element: <SalesReportPage />,
      },
      {
        path: "reports/commissions",
        element: <CommissionsReportPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
