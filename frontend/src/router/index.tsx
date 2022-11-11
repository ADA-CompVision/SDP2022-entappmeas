import { createBrowserRouter, Navigate } from "react-router-dom";
import { Attribute, Category, Product } from "../pages";
import { Dashboard, Login, Register } from "../routes";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { element: <Navigate to="category" replace />, index: true },
      { path: "category", element: <Category /> },
      { path: "attribute", element: <Attribute /> },
      { path: "product", element: <Product /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

export default router;
