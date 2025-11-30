import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

export default function ReadingDetail() {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterialAndStart = async () => {
            try {
                // Ambil detail material
                const detailRes = await api.get(`/material/${id}`);
                setMaterial(detailRes.data.material);

                // Mark material as "sedang dipelajari" jika belum selesai
                if (!detailRes.data.material.progress?.is_completed) {
                    await api.post(`/material/${id}/start`);
                }
            } catch (err) {
                console.error("Error fetching material:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterialAndStart();
    }, [id]);

    const handleComplete = async () => {
        try {
            await api.post(`/material/${id}/complete`);
            // Update local state
            setMaterial((prev) => ({
                ...prev,
                progress: {
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                },
            }));
            alert("Materi telah ditandai sebagai selesai!");
        } catch (err) {
            console.error("Error completing material:", err);
            alert("Gagal menandai materi sebagai selesai");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center">
                <p className="text-gray-600">Memuat materi...</p>
            </div>
        );
    }

    if (!material) {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center">
                <p className="text-red-600">Materi tidak ditemukan</p>
            </div>
        );
    }

    const isCompleted = material.progress?.is_completed || false;

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col">
            <div className="border-b-2 border-gray-400 flex pl-8 pt-8 pb-8 items-center text-gray-800 gap-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    {material.title}
                </h1>
            </div>
            <main className="flex-grow p-8">
                <div className="mb-4">
                    {isCompleted ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            ✓ Selesai
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Sedang dipelajari
                        </span>
                    )}
                </div>

                {/* PDF Viewer */}
                {material.pdf_url ? (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Dokumen PDF
                        </h3>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <iframe
                                src={material.pdf_url}
                                style={{ width: "100%", height: "600px" }}
                                title={material.title}
                                className="w-full"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                            Tidak ada dokumen PDF untuk materi ini.
                        </p>
                    </div>
                )}

                {!isCompleted && (
                    <div className="mt-6">
                        <button
                            onClick={handleComplete}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150"
                        >
                            Tandai sebagai Selesai
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}