import { useEffect, useState } from "react";
import axios from "axios";

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get("/api/admin/quizzes").then((res) => setQuizzes(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/quizzes", { title });
    const res = await axios.get("/api/admin/quizzes");
    setQuizzes(res.data);
    setTitle("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Kuis</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Judul kuis"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Judul</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td className="border p-2">{q.title}</td>
              <td className="border p-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuizzes;
