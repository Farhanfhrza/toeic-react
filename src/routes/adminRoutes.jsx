import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../components/privateRoute";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageClasses from "../pages/admin/ManageClasses";
import ManageMaterials from "../pages/admin/ManageMaterials";
import ManageQuestions from "../pages/admin/ManageQuestions";
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
// import ViewResults from "../pages/admin/ViewResults";

export const adminRoutes = {
    path: "/admin",
    element: (
        <PrivateRoute roles={["admin", "teacher"]}>
            <AdminLayout />
        </PrivateRoute>
    ),
    children: [
        { index: true, element: <Dashboard /> },
        { path: "users", element: <ManageUsers /> },
        { path: "classes", element: <ManageClasses /> },
        { path: "materials", element: <ManageMaterials /> },
        { path: "questions", element: <ManageQuestions /> },
        // { path: "results", element: <ViewResults /> },
    ],
};
