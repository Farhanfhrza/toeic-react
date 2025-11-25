import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { identifier, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "student") navigate("/dashboard");
      else navigate("/admin");
      // navigate("/quizzes");
    } catch (err) {
      alert("Login gagal!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-1/3"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Selamat datang kembali !</h1>
        <p className="text-lg text-center mb-6">Masuk untuk melanjutkan perjalanan belajarmu dan tingkatkan skor TOEIC-mu.</p>

        <p className="text-xl font-bold">NISN</p>
        <input
          type="text"
          placeholder="NISN atau Email"
          className="w-full border p-2 mb-3 rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <p className="text-xl font-bold">Password</p>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Masuk
        </button>
      </form>
    </div>
  );
}
