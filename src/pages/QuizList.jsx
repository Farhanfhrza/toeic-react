import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/quizzes");
      setQuizzes(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Kuis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            <h2 className="text-lg font-semibold">{quiz.title}</h2>
            <p className="text-sm text-gray-600">{quiz.description}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
