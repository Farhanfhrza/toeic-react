import { useEffect, useState } from "react";
import axios from "axios";

const ViewResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/results").then((res) => setResults(res.data));
  }, []);

  const handleExport = async () => {
    const res = await axios.get("/api/admin/results/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hasil_ujian.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hasil Ujian</h1>

      <button
        onClick={handleExport}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Export Excel
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">No</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Email/NISN</th>
            <th className="border p-2">Kuis</th>
            <th className="border p-2">Nilai</th>
            <th className="border p-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={r.id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{r.student}</td>
              <td className="border p-2">{r.email}</td>
              <td className="border p-2">{r.quiz}</td>
              <td className="border p-2 text-center">{r.score}</td>
              <td className="border p-2">
                {new Date(r.date).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResults;
