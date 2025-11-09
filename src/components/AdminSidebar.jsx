import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const menu = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/users", label: "Kelola Pengguna" },
    { path: "/admin/quizzes", label: "Kelola Kuis" },
    { path: "/admin/questions", label: "Kelola Soal" },
    { path: "/admin/results", label: "Hasil Ujian" },
  ];

  return (
    <div className="bg-gray-800 text-white w-60 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-3">
        {menu.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            className={`p-2 rounded hover:bg-gray-700 ${
              location.pathname === m.path ? "bg-gray-700" : ""
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
