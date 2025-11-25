// import { lazy } from "react";
import PrivateRoute from "../components/privateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";

export const dashboardRoutes = {
    path: "/dashboard",
    element: (
        <PrivateRoute roles={["student"]}>
            <DashboardLayout />
        </PrivateRoute>
    ),
    children: [
        { index: true, element: <Dashboard /> },
    ],
};
