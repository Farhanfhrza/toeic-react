import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { adminRoutes } from "./adminRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { readingRoutes } from "./readingRoutes";
import { listeningRoutes } from "./listeningRoutes";
import { quizRoutes } from "./quizRoutes";

export const appRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  adminRoutes, 
  dashboardRoutes,
  readingRoutes,
  listeningRoutes,
  quizRoutes,
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];