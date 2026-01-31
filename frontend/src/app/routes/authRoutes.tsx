import { lazy } from "react";
import { type RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { RoleProtectedRoute } from "./role-protected-route";
import { RoleBasedRedirect } from "./role-based-redirect";
import { MainLayout } from "../../layout/main-layout";

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
        element: <RoleBasedRedirect />,
      },
      {
        path: "users",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <UsersListPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "users/new",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <UserFormPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <UserFormPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN", "PARTNER", "CUSTOMER"]}>
            <ProductsListPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "products/new",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN", "PARTNER", "CUSTOMER"]}>
            <ProductFormPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "products/:id/edit",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN", "PARTNER", "CUSTOMER"]}>
            <ProductFormPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "sales",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN", "PARTNER"]}>
            <SalesListPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "sales/new",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN", "PARTNER"]}>
            <SaleFormPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "reports/sales",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <SalesReportPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "reports/commissions",
        element: (
          <RoleProtectedRoute allowedRoles={["ADMIN", "PARTNER"]}>
            <CommissionsReportPage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
