import { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get(`/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuiz(res.data);
    };
    fetchQuiz();
  }, [id]);

  const handleSelect = (question_id, option_id) => {
    setAnswers({ ...answers, [question_id]: option_id });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      quiz_id: id,
      answers: Object.entries(answers).map(([question_id, option_id]) => ({
        question_id,
        option_id,
      })),
    };
    await api.post("/results/submit", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/result");
  };

  if (!quiz) return <p className="text-center mt-10">Loading...</p>;

  const question = quiz.Questions[current];

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">{quiz.title}</h1>

      <QuestionCard
        question={{ ...question, number: current + 1 }}
        selected={answers[question.id]}
        onSelect={handleSelect}
      />

      {/* Navigasi */}
      <div className="flex justify-between items-center">
        <button
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Sebelumnya
        </button>

        <div className="flex gap-2 flex-wrap justify-center">
          {quiz.Questions.map((_, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 rounded-full ${
                current === idx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrent(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {current < quiz.Questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Selesai
          </button>
        )}
      </div>
    </div>
  );
}
