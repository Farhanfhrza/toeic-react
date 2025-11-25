import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useRoutes,
} from "react-router-dom";
import { appRoutes } from "./routes";

function AppRoutes() {
    const routes = useRoutes(appRoutes);
    return routes;
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
            {/* <Routes>
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
            </Routes> */}
        </BrowserRouter>
    );
}
