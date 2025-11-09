import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/quizzes")}
      >
        Ujian Online
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
      >
        Logout
      </button>
    </nav>
  );
}
