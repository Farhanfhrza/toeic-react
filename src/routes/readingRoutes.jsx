import PrivateRoute from "../components/privateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import ReadingList from "../pages/reading/List";
import ReadingDetail from "../pages/reading/Detail";
// import ReadingExercise from "../pages/reading/Exercise";
// import ReadingReview from "../pages/reading/Review";

export const readingRoutes = {
    path: "/reading",
    element: (
        <PrivateRoute roles={["student"]}>
            <DashboardLayout />
        </PrivateRoute>
    ),
    children: [
        { index: true, element: <ReadingList /> },
        { path: ":id", element: <ReadingDetail /> },
        // { path: ":id/exercise", element: <ReadingExercise /> },
        // { path: ":id/review", element: <ReadingReview /> },
    ],
};