import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookText, AudioLines, CheckSquare, LogOut } from "lucide-react";
import api from "../api";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = async () => {
        if (!window.confirm("Apakah Anda yakin ingin keluar?")) {
            return;
        }
    
        try {
            await api.post(`auth/logout`);
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Jika Anda menyimpan data pengguna
            navigate("/login");
        } catch (error) {
            console.error("Gagal Logout:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };
    const navItems = [
        {
            icon: <Home size={20} />,
            label: "Beranda",
            to: "/dashboard", // Ganti 'id' dengan 'to' untuk Link
        },
        {
            icon: <BookText size={20} />,
            label: "Materi Reading",
            to: "/reading",
        },
        {
            icon: <AudioLines size={20} />,
            label: "Materi Listening",
            to: "/listening",
        },
        {
            icon: <CheckSquare size={20} />,
            label: "Simulasi Ujian",
            to: "/quiz",
        },
    ];

    const getIsActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="w-64 bg-white h-screen flex flex-col border-r fixed top-0 left-0 z-10">
            {/* Logo/Nama Aplikasi */}
            <div className="p-6 text-xl font-bold text-gray-800">VToeic</div>

            {/* Navigasi Utama */}
            <nav className="flex-grow p-4">
                {navItems.map((item) => {
                    // Tentukan apakah item ini aktif
                    const isActive = getIsActive(item.to);

                    return (
                        // Ganti <div> dengan Link dari react-router-dom
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
                                isActive
                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Informasi Pengguna & Logout */}
            <div className="p-4 border-t">
                <p className="text-sm font-semibold text-gray-800">
                    Denis Supriyadi
                </p>
                <p className="text-xs text-gray-500">12345678</p>
                <button onClick={handleLogout} className="flex items-center justify-center w-full mt-4 py-2 px-3 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                    <LogOut size={16} className="mr-2" />
                    Keluar
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
