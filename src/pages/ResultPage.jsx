import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ResultPage() {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/results/latest", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat hasil ujian");
      }
    };
    fetchResults();
  }, []);

  if (!results)
    return <p className="text-center mt-10 text-gray-600">Memuat hasil...</p>;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Hasil Ujian</h1>
        <div className="bg-white border shadow p-6 rounded-lg w-full md:w-2/3">
          <p className="text-lg font-semibold mb-2">
            {results.quiz.title}
          </p>
          <p className="text-gray-700 mb-2">Skor Anda:</p>
          <p className="text-3xl font-bold text-green-600 mb-4">
            {results.score} / {results.total}
          </p>
          <button
            onClick={() => navigate("/quizzes")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    </>
  );
}
