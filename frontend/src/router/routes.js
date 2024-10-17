import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import HomePage from "../Home/homePage";
import OrderPage from "../Order/orderPage";
import NotFound from "../NotFound/notFound";
import Login from "../Login/login";
import Register from "../Register/register";
import ServiceManagementPage from "../ServiceManagementPage/serviceManagementPage";
import RequireAuth from "./requireAuth";
import DemoPage from "../DemoPage/demoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        element: <RequireAuth roles={["User"]} />,
        children: [{ path: "demo", element: <DemoPage /> }],
      },
      {
        element: <RequireAuth roles={["Admin", "Member"]} />,
        children: [
          { path: "serviceManagement", element: <ServiceManagementPage /> },
          { path: "order", element: <OrderPage /> },
        ],
      },
      {
        path: "not-found",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate replace to="/not-found" />,
      },
    ],
  },
]);
