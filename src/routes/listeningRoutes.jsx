import PrivateRoute from "../components/privateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ListeningList from "../pages/listening/List";
import ListeningDetail from "../pages/listening/Detail";
// import ListeningExercise from "../pages/listening/Exercise";
// import ListeningReview from "../pages/listening/Review";

export const listeningRoutes = {
    path: "/listening",
    element: (
        <PrivateRoute roles={["student"]}>
            <DashboardLayout />
        </PrivateRoute>
    ),
    children: [
        { index: true, element: <ListeningList /> },
        { path: ":id", element: <ListeningDetail /> },
        // { path: ":id/exercise", element: <ListeningExercise /> },
        // { path: ":id/review", element: <ListeningReview /> },
    ],
};