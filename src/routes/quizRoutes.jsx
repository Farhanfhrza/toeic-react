import PrivateRoute from "../components/privateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import QuizMenu from "../pages/quiz/Menu";
import QuizList from "../pages/quiz/List";
import QuizInstructions from "../pages/quiz/Instructions";
import QuizQuestions from "../pages/quiz/Questions";
import QuizFinish from "../pages/quiz/Finish";

export const quizRoutes = {
    path: "/quiz",
    element: (
        <PrivateRoute roles={["student"]}>
            <DashboardLayout />
        </PrivateRoute>
    ),
    children: [
        { index: true, element: <QuizMenu /> },
        { path: "list/:category", element: <QuizList /> }, // :type = reading | listening
        { path: "instructions/:materialId", element: <QuizInstructions /> },
        { path: "questions/:attemptId", element: <QuizQuestions /> },
        { path: "finish/:attemptId", element: <QuizFinish /> },


        // { path: ":id/instructions", element: <QuizInstructions /> },
        // { path: ":id/questions", element: <QuizQuestions /> },
        // { path: ":id/finish", element: <QuizFinish /> },
    ],
};
