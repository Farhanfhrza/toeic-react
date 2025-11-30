import { Link } from "react-router-dom";
import { BookOpen, Headphones, ArrowRight, BookText } from "lucide-react";

export default function QuizMenu() {
    const categories = [
        {
            id: "reading",
            title: "Reading",
            description: "Latih kemampuan membaca dan memahami teks bahasa Inggris",
            icon: BookOpen,
            gradient: "from-blue-600 to-cyan-600",
            hoverGradient: "from-blue-700 to-cyan-700",
            bgGradient: "from-blue-50 to-cyan-50",
            link: "/quiz/list/reading",
        },
        {
            id: "listening",
            title: "Listening",
            description: "Latih kemampuan mendengarkan dan memahami audio bahasa Inggris",
            icon: Headphones,
            gradient: "from-purple-600 to-pink-600",
            hoverGradient: "from-purple-700 to-pink-700",
            bgGradient: "from-purple-50 to-pink-50",
            link: "/quiz/list/listening",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6 md:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <BookText className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                        Pilih Jenis Latihan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Pilih kategori latihan yang ingin Anda kerjakan untuk meningkatkan kemampuan TOEIC Anda
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <Link
                                key={category.id}
                                to={category.link}
                                className="group block"
                            >
                                <div
                                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-${category.id === "reading" ? "blue" : "purple"}-300 transform hover:-translate-y-2`}
                                >
                                    {/* Card Header dengan Gradient */}
                                    <div
                                        className={`bg-gradient-to-r ${category.gradient} p-8 text-white relative overflow-hidden`}
                                    >
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                                                    <IconComponent size={32} />
                                                </div>
                                                <ArrowRight
                                                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"
                                                    size={24}
                                                />
                                            </div>
                                            <h2 className="text-3xl font-bold mb-2">
                                                {category.title}
                                            </h2>
                                            <p className="text-white/90 text-sm">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Kategori Latihan
                                                </p>
                                                <p className="text-gray-800 font-semibold">
                                                    {category.title} Practice
                                                </p>
                                            </div>
                                            <div
                                                className={`p-3 rounded-lg bg-gradient-to-r ${category.bgGradient}`}
                                            >
                                                <IconComponent
                                                    className={`text-${category.id === "reading" ? "blue" : "purple"}-600`}
                                                    size={24}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Hint */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Klik untuk melihat materi
                                                </span>
                                                <div
                                                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.bgGradient} text-${category.id === "reading" ? "blue" : "purple"}-700 font-semibold text-xs`}
                                                >
                                                    Mulai →
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-12 max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BookText className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Tips Mengerjakan Latihan
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Baca instruksi dengan teliti sebelum memulai</li>
                                    <li>• Kerjakan dengan tenang dan fokus</li>
                                    <li>• Manfaatkan waktu sebaik mungkin</li>
                                    <li>• Review jawaban sebelum submit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
