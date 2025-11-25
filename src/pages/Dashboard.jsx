import {
    Home,
    User,
    BookOpen,
    Headset,
    CheckSquare,
    Clock,
    Edit,
} from "lucide-react";

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
const MaterialStatusCard = ({ title, icon, color }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between h-32">
            <div className="text-gray-500 text-sm font-semibold">{title}</div>
            {/* Placeholder untuk ilustrasi/gambar kecil */}
            <div
                className={`w-20 h-20 rounded-full bg-blue-50/50 flex items-center justify-center text-4xl text-blue-400`}
            >
                {/* Placeholder ilustrasi yang digambar */}
                <BookOpen size={40} />
            </div>
        </div>
    );
};

// --- Komponen Utama: Dashboard ---
const Dashboard = () => {
    // Data Profil Statis
    const profile = {
        name: "Denis Supriyadi",
        nim: "12345678",
        jurusan: "Teknik Informatika",
        kelas: "IF-05",
        password: "••••••••••••",
    };

    // Data Progress
    const progressData = [
        {
            category: "Listening",
            subchapter: "Everyday Conversations",
            score: "22/25",
            completion: "75%",
            lastAttempt: "Nov 7",
            color: "blue",
        },
        {
            category: "Reading",
            subchapter: "Grammar Essentials",
            score: "23/25",
            completion: "100%",
            lastAttempt: "8 Nov",
            color: "green",
        },
    ];

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
                        {profile.name}
                    </h3>
                    <p className="text-gray-500 mb-6">{profile.nim}</p>
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
                                    {profile.jurusan}
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
                                    {profile.kelas}
                                </span>
                            </div>
                        </div>

                        {/* Kata Sandi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Kata Sandi
                            </label>
                            <div className="flex justify-between items-center border-b border-gray-200 py-1">
                                <span className="text-gray-700">
                                    {profile.password}
                                </span>
                                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <Edit size={16} />
                                </button>
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
                    />
                    <MaterialStatusCard
                        title="Reading"
                        icon={BookOpen}
                        color="red"
                    />
                </div>
            </div>

            {/* 2. Progress Overview Table */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Progress overview
                </h3>

                {/* Tabel */}
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
            </div>
        </div>
    );
};

export default Dashboard;
