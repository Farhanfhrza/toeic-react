import { useEffect, useState } from "react";
import axios from "axios";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({
    quiz_id: "",
    question_text: "",
    correct_option: "A",
    options: { A: "", B: "", C: "", D: "" },
  });
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/questions").then((res) => setQuestions(res.data));
    axios.get("/api/admin/quizzes").then((res) => setQuizzes(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/questions", newQ);
    const res = await axios.get("/api/admin/questions");
    setQuestions(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Soal</h1>

      <form onSubmit={handleAdd} className="border p-4 rounded mb-6">
        <select
          value={newQ.quiz_id}
          onChange={(e) => setNewQ({ ...newQ, quiz_id: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Pilih Kuis</option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Teks Soal"
          value={newQ.question_text}
          onChange={(e) => setNewQ({ ...newQ, question_text: e.target.value })}
          className="border p-2 w-full mb-2"
        ></textarea>

        {["A", "B", "C", "D"].map((opt) => (
          <input
            key={opt}
            type="text"
            placeholder={`Opsi ${opt}`}
            value={newQ.options[opt]}
            onChange={(e) =>
              setNewQ({
                ...newQ,
                options: { ...newQ.options, [opt]: e.target.value },
              })
            }
            className="border p-2 w-full mb-2"
          />
        ))}

        <select
          value={newQ.correct_option}
          onChange={(e) => setNewQ({ ...newQ, correct_option: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="A">Jawaban Benar: A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Tambah Soal
        </button>
      </form>
    </div>
  );
};

export default ManageQuestions;
