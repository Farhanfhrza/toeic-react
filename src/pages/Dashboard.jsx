import { useEffect, useState } from "react";
import {
    Home,
    User,
    BookOpen,
    Headset,
    CheckSquare,
    Clock,
    Edit,
} from "lucide-react";
import api from "../api";

// --- Komponen Pembantu: Header Banner ---
const HeaderBanner = () => {
    return (
        <div className="relative bg-black text-white p-8 rounded-xl overflow-hidden mb-8 shadow-lg h-40 flex items-center">
            {/* Wave dan background abstrak */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{
                    backgroundImage:
                        "linear-gradient(135deg, #2b3137 0%, #1a1e22 100%)",
                }}
            ></div>

            {/* Ilustrasi abstrak di pojok kanan atas */}
            <div className="absolute top-0 right-0 w-48 h-full overflow-hidden">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                    {/* Bentuk hitam dengan highlight merah */}
                    <path
                        d="M0,80 C150,20 350,140 500,100 L500,0 L0,0 Z"
                        style={{ fill: "#1a1e22" }}
                    ></path>

                    {/* Ilustrasi roket/pena/benda merah */}
                    <circle
                        cx="450"
                        cy="50"
                        r="10"
                        fill="#FF0000"
                        className="opacity-80"
                    ></circle>
                    <rect
                        x="420"
                        y="35"
                        width="40"
                        height="30"
                        rx="5"
                        fill="#FF0000"
                        transform="rotate(30 440 50)"
                    ></rect>

                    {/* Contoh Sederhana Ilustrasi yang menyerupai roket/pena di gambar */}
                    <rect
                        x="430"
                        y="40"
                        width="100"
                        height="15"
                        rx="5"
                        fill="#FF0000"
                        transform="rotate(30 480 40)"
                    ></rect>
                </svg>
            </div>

            {/* Konten Text */}
            <div className="relative z-10">
                <span className="text-sm font-light opacity-80">Beranda</span>
                <h2 className="text-3xl font-bold mt-1">
                    Saatnya Melangkah, <br /> Bukan Hanya Bermimpi.
                </h2>
            </div>
        </div>
    );
};

// --- Komponen Pembantu: Materi Card Kecil ---
const MaterialStatusCard = ({ title, icon, color, total, completed }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const IconComponent = icon;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between h-32">
            <div>
                <div className="text-gray-500 text-sm font-semibold mb-2">{title}</div>
                <div className="text-2xl font-bold text-gray-800">
                    {completed}/{total}
                </div>
                <div className="text-xs text-gray-500 mt-1">{percentage}% selesai</div>
            </div>
            {/* Placeholder untuk ilustrasi/gambar kecil */}
            <div
                className={`w-20 h-20 rounded-full bg-blue-50/50 flex items-center justify-center text-4xl text-blue-400`}
            >
                <IconComponent size={40} />
            </div>
        </div>
    );
};

// --- Komponen Utama: Dashboard ---
const Dashboard = () => {
    const [profile, setProfile] = useState({
        name: "",
        nisn: "",
        jurusan: "",
        kelas: "",
    });
    const [materialStats, setMaterialStats] = useState({
        listening: { total: 0, completed: 0 },
        reading: { total: 0, completed: 0 },
    });
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get("/dashboard");
                if (res.data.success) {
                    setProfile(res.data.profile);
                    setMaterialStats(res.data.materialStats);
                    setProgressData(res.data.progressOverview || []);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <p className="text-gray-600">Memuat data dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* 1. Header Banner */}
            <HeaderBanner />

            {/* Konten Utama */}
            <div className="grid grid-cols-12 gap-8">
                {/* Kolom Kiri: Profil Detail */}
                <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-xl shadow-md">
                    {/* Detail Nama dan NIM */}
                    <h3 className="text-xl font-semibold text-gray-800">
                        {profile.name || "Loading..."}
                    </h3>
                    <p className="text-gray-500 mb-6">{profile.nisn || "N/A"}</p>
                    <hr className="mb-4" />

                    {/* Form Detail */}
                    <div className="space-y-4">
                        {/* Jurusan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Jurusan
                            </label>
                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                <span className="text-gray-700">
                                    {profile.jurusan || "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Kelas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Kelas
                            </label>
                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                <span className="text-gray-700">
                                    {profile.kelas || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Status Materi */}
                <div className="col-span-12 lg:col-span-5 space-y-4">
                    <MaterialStatusCard
                        title="Listening"
                        icon={Headset}
                        color="blue"
                        total={materialStats.listening.total}
                        completed={materialStats.listening.completed}
                    />
                    <MaterialStatusCard
                        title="Reading"
                        icon={BookOpen}
                        color="red"
                        total={materialStats.reading.total}
                        completed={materialStats.reading.completed}
                    />
                </div>
            </div>

            {/* 2. Progress Overview Table */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Progress overview
                </h3>

                {/* Tabel */}
                {progressData.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50/50 text-blue-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Subchapter
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Completion
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                                        Last attempt
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {progressData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.subchapter}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.score}
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                                            style={{
                                                color:
                                                    item.completion === "100%"
                                                        ? "#10B981"
                                                        : "#2563EB",
                                            }}
                                        >
                                            {item.completion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.lastAttempt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
                        <p className="text-gray-500">
                            Belum ada progress. Mulai kerjakan latihan untuk melihat progress Anda!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
