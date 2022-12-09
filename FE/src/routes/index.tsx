import {
  createBrowserRouter, Outlet,
} from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { DashboardPage } from "../pages/Dashboard/Dashboard";
import { LoginPage } from "../pages/Login/Login";
import { PasswordChangePage } from "../pages/PasswordChange/PasswordChange";
import { SettingsPage } from "../pages/Settings/Settings";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Outlet/></Layout>,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: 'dashboard',
        element: 
        <ProtectedRoute permissions={["passwordChanged"]} redirectPath="/change-password">
          <DashboardPage />
        </ProtectedRoute>
      },
      {
        path: 'change-password',
        element: 
        <ProtectedRoute permissions={["user"]} redirectPath="/login">
          <PasswordChangePage />
        </ProtectedRoute>
      },
      {
        path: 'settings',
        element: 
        <ProtectedRoute permissions={["user", "passwordChanged"]} redirectPath="/login">
          <SettingsPage />
        </ProtectedRoute>
      }

    ],
  },
]);