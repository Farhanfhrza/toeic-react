import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    Users,
    School,
    BookOpen,
    FileQuestion,
    LogOut,
} from "lucide-react";
import api from "../api";

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ name: "Admin", identifier: "" });

    useEffect(() => {
        // Ambil info user dari localStorage atau API
        const role = localStorage.getItem("role");
        // Bisa juga fetch dari API jika diperlukan
    }, []);

    const handleLogout = async () => {
        if (!window.confirm("Apakah Anda yakin ingin keluar?")) {
            return;
        }
        try {
            await api.post(`/auth/logout`);
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error("Gagal Logout:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const navItems = [
        {
            icon: <Home size={20} />,
            label: "Dashboard",
            to: "/admin",
        },
        {
            icon: <Users size={20} />,
            label: "Kelola Pengguna",
            to: "/admin/users",
        },
        {
            icon: <School size={20} />,
            label: "Kelola Kelas",
            to: "/admin/classes",
        },
        {
            icon: <BookOpen size={20} />,
            label: "Kelola Materi",
            to: "/admin/materials",
        },
        {
            icon: <FileQuestion size={20} />,
            label: "Kelola Soal",
            to: "/admin/questions",
        },
    ];

    const getIsActive = (path) => {
      if (path === "/admin") {
          return location.pathname === "/admin";
      }
      if (location.pathname === "/admin") {
          return false; 
      }
      return location.pathname.startsWith(path);
  };

    return (
        <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-screen flex flex-col border-r border-gray-700 fixed top-0 left-0 z-10 shadow-xl">
            {/* Logo/Nama Aplikasi */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Home className="text-white" size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-white">VToeic</div>
                        <div className="text-xs text-gray-400">Admin Panel</div>
                    </div>
                </div>
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = getIsActive(item.to);

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                            >
                                <span
                                    className={`${
                                        isActive ? "text-white" : "text-gray-400"
                                    }`}
                                >
                                    {item.icon}
                                </span>
                                <span className="ml-3 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Informasi Pengguna & Logout */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="mb-3">
                    <p className="text-sm font-semibold text-white">
                        {userInfo.name}
                    </p>
                    <p className="text-xs text-gray-400">{userInfo.identifier}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full py-2 px-3 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                    <LogOut size={16} className="mr-2" />
                    Keluar
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
