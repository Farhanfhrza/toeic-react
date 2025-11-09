import { BrowserRouter, Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { appRoutes } from "./routes";
import Login from "./pages/Login";
import ViewResults from "./pages/admin/ViewResults";
import QuizList from "./pages/QuizList";
import QuizDetail from "./pages/QuizDetail";
import ResultPage from "./pages/ResultPage";
import Navbar from "./components/Navbar";

function AppRoutes() {
  const routes = useRoutes(appRoutes);
  return routes;
}

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
        <AppRoutes />
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route
          path="/student/*"
          element={
            <PrivateRoute roles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/quizzes"
          element={
            <>
              <Navbar />
              <QuizList />
            </>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <>
              <Navbar />
              <QuizDetail />
            </>
          }
        />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/admin/results" element={<ViewResults />} />
      </Routes>
    </BrowserRouter>
  );
}
