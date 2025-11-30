import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import { BookOpen, ArrowRight, CheckCircle } from "lucide-react";

export default function List() {
    const { category } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/material?category=${category}`)
            .then((res) => {
                setMaterials(res.data);
            })
            .catch((err) => {
                console.error("Error fetching materials:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat materi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-600 rounded-lg">
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 capitalize">
                            Materi {category}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Pilih materi yang ingin Anda pelajari
                        </p>
                    </div>
                </div>
            </div>

            {/* Materials Grid */}
            {materials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((m) => (
                        <div
                            key={m.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                        >
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                                            {m.title}
                                        </h3>
                                        <p className="text-blue-100 text-sm">
                                            {category === "reading"
                                                ? "Reading Material"
                                                : "Listening Material"}
                                        </p>
                                    </div>
                                    {m.progress?.is_completed && (
                                        <CheckCircle
                                            className="text-white"
                                            size={24}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {m.content_text || "Latih kemampuan Anda dengan materi ini"}
                                </p>

                                {/* Progress Indicator */}
                                {m.progress && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>
                                                {m.progress.is_completed
                                                    ? "100%"
                                                    : "Sedang dipelajari"}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    m.progress.is_completed
                                                        ? "bg-green-500 w-full"
                                                        : "bg-blue-500 w-1/2"
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <Link
                                    to={`/quiz/instructions/${m.id}`}
                                    className="block w-full"
                                >
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                        <span>Mulai Latihan</span>
                                        <ArrowRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <BookOpen
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Belum ada materi
                    </h3>
                    <p className="text-gray-500">
                        Materi untuk kategori {category} belum tersedia
                    </p>
                </div>
            )}
        </div>
    );
}
