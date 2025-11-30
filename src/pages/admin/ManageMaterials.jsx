import { useEffect, useState } from "react";
import api from "../../api";
import { Plus, Edit, Trash2, BookOpen, FileText, Upload, X } from "lucide-react";

export default function ManageMaterials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content_text: "",
        menu_category: "reading",
        display_order: "",
        pdf_url: "",
    });

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await api.get("/admin/materials");
            if (res.data.success) {
                setMaterials(res.data.materials);
            }
        } catch (err) {
            console.error("Error fetching materials:", err);
            alert("Gagal memuat data materi");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMaterial) {
                await api.put(`/admin/materials/${editingMaterial.id}`, formData);
                alert("Materi berhasil diperbarui");
            } else {
                await api.post("/admin/materials", formData);
                alert("Materi berhasil ditambahkan");
            }
            setShowModal(false);
            setEditingMaterial(null);
            setFormData({
                title: "",
                content_text: "",
                menu_category: "reading",
                display_order: "",
                pdf_url: "",
            });
            fetchMaterials();
        } catch (err) {
            console.error("Error saving material:", err);
            alert(err.response?.data?.message || "Gagal menyimpan materi");
        }
    };

    const handleEdit = (material) => {
        setEditingMaterial(material);
        setPdfFile(null);
        setFormData({
            title: material.title,
            content_text: material.content_text || "",
            menu_category: material.menu_category,
            display_order: material.display_order,
            pdf_url: material.pdf_url || "",
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
            return;
        }
        try {
            await api.delete(`/admin/materials/${id}`);
            alert("Materi berhasil dihapus");
            fetchMaterials();
        } catch (err) {
            console.error("Error deleting material:", err);
            alert(err.response?.data?.message || "Gagal menghapus materi");
        }
    };

    const openModal = () => {
        setEditingMaterial(null);
        setPdfFile(null);
        setFormData({
            title: "",
            content_text: "",
            menu_category: "reading",
            display_order: "",
            pdf_url: "",
        });
        setShowModal(true);
    };

    const handlePDFUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Hanya file PDF yang diizinkan");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Ukuran file maksimal 10MB");
            return;
        }

        setUploadingPDF(true);
        setPdfFile(file);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("pdf", file);

            const res = await api.post("/upload/pdf", uploadFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                // Get base URL from api instance (remove /api)
                const baseURL = (api.defaults.baseURL || "http://localhost:5000/api").replace("/api", "");
                const fullUrl = baseURL + res.data.url;
                setFormData((prev) => ({ ...prev, pdf_url: fullUrl }));
                alert("PDF berhasil diupload");
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert(error.response?.data?.message || "Gagal mengupload PDF");
            setPdfFile(null);
        } finally {
            setUploadingPDF(false);
        }
    };

    const removePDF = () => {
        setPdfFile(null);
        setFormData((prev) => ({ ...prev, pdf_url: "" }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <BookOpen className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Kelola Materi
                                </h1>
                                <p className="text-gray-600">
                                    Tambah, edit, atau hapus data materi pembelajaran
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus size={20} />
                            Tambah Materi
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {materials.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Belum ada data materi
                                        </td>
                                    </tr>
                                ) : (
                                    materials.map((material, index) => (
                                        <tr
                                            key={material.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {material.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        material.menu_category === "reading"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }`}
                                                >
                                                    {material.menu_category === "reading"
                                                        ? "Reading"
                                                        : "Listening"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {material.display_order}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(material)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(material.id)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingMaterial ? "Edit Materi" : "Tambah Materi"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Judul Materi
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi/Konten
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.content_text}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content_text: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        required
                                        value={formData.menu_category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                menu_category: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="reading">Reading</option>
                                        <option value="listening">Listening</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Urutan Tampil
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.display_order}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                display_order: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File PDF (Opsional)
                                </label>
                                {formData.pdf_url ? (
                                    <div className="mb-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText size={20} className="text-red-600" />
                                            <span className="text-sm text-gray-700">
                                                PDF sudah diupload
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removePDF}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploadingPDF ? (
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PDF (MAX. 10MB)
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handlePDFUpload}
                                                disabled={uploadingPDF}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                )}
                                {pdfFile && !formData.pdf_url && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Mengupload: {pdfFile.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingMaterial(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    {editingMaterial ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

