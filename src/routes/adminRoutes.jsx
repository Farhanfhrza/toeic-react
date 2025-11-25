import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../components/privateRoute";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageQuestions from "../pages/admin/ManageQuestions";
import ManageQuizzes from "../pages/admin/ManageQuizzes";
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
import ViewResults from "../pages/admin/ViewResults";

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
        { path: "quizzes", element: <ManageQuestions /> },
        { path: "questions", element: <ManageQuizzes /> },
        { path: "results", element: <ViewResults /> },
    ],
};
