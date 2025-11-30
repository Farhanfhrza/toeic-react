import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import {
    BookOpen,
    Clock,
    CheckCircle2,
    AlertCircle,
    Play,
    ArrowLeft,
    FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Instructions() {
    const { materialId } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const res = await api.get(`/material/${materialId}`);
                if (res.data.success) {
                    setMaterial(res.data.material);
                }
            } catch (err) {
                console.error("Error fetching material:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterial();
    }, [materialId]);

    const start = async () => {
        setStarting(true);
        try {
            const res = await api.post("/exercise/start", {
                material_id: materialId,
            });

            const attempt = res.data.attempt;
            navigate(`/quiz/questions/${attempt.id}`);
        } catch (err) {
            console.error("Error starting exercise:", err);
            alert("Gagal memulai latihan. Silakan coba lagi.");
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat instruksi...</p>
                </div>
            </div>
        );
    }

    if (!material) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <p className="text-gray-600">Materi tidak ditemukan</p>
                    <Link
                        to="/quiz"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Kembali ke Menu
                    </Link>
                </div>
            </div>
        );
    }

    const category = material.menu_category;
    const isCompleted = material.progress?.is_completed;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Back Button */}
                <Link
                    to={`/quiz/list/${category}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali ke Daftar Materi</span>
                </Link>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Header dengan Gradient */}
                    <div
                        className={`bg-gradient-to-r ${
                            category === "reading"
                                ? "from-blue-600 to-cyan-600"
                                : "from-purple-600 to-pink-600"
                        } p-8 text-white`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <span className="text-sm text-white/80 uppercase tracking-wide">
                                            {category === "reading"
                                                ? "Reading Material"
                                                : "Listening Material"}
                                        </span>
                                        {isCompleted && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <CheckCircle2 size={16} />
                                                <span className="text-xs">
                                                    Selesai
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {material.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Material Description */}
                        {material.content_text && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="text-gray-600" size={20} />
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Deskripsi Materi
                                    </h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {material.content_text}
                                </p>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-blue-600" size={20} />
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Instruksi Pengerjaan
                                </h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            Baca dan pahami setiap soal dengan teliti
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Pastikan Anda memahami pertanyaan sebelum
                                            memilih jawaban
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            Pilih jawaban yang paling tepat
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Anda dapat mengubah jawaban sebelum
                                            menyelesaikan latihan
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            Review jawaban sebelum submit
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Pastikan semua soal sudah terjawab sebelum
                                            menyelesaikan latihan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        Tips Sukses
                                    </h3>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Kerjakan dengan tenang dan fokus</li>
                                        <li>• Manfaatkan waktu sebaik mungkin</li>
                                        <li>• Jangan terburu-buru dalam menjawab</li>
                                        <li>• Gunakan navigasi untuk review jawaban</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to={`/quiz/list/${category}`}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all text-center"
                            >
                                Kembali
                            </Link>
                            <button
                                onClick={start}
                                disabled={starting}
                                className={`flex-1 px-6 py-4 bg-gradient-to-r ${
                                    category === "reading"
                                        ? "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                        : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                } text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {starting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Memulai...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} />
                                        <span>Mulai Latihan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
