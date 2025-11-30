import { useEffect, useState } from "react";
import api from "../../api";
import { Plus, Edit, Trash2, Users, School } from "lucide-react";

export default function ManageClasses() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({ name: "", level: "" });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get("/admin/classes");
            if (res.data.success) {
                setClasses(res.data.classes);
            }
        } catch (err) {
            console.error("Error fetching classes:", err);
            alert("Gagal memuat data kelas");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClass) {
                await api.put(`/admin/classes/${editingClass.id}`, formData);
                alert("Kelas berhasil diperbarui");
            } else {
                await api.post("/admin/classes", formData);
                alert("Kelas berhasil ditambahkan");
            }
            setShowModal(false);
            setEditingClass(null);
            setFormData({ name: "", level: "" });
            fetchClasses();
        } catch (err) {
            console.error("Error saving class:", err);
            alert(err.response?.data?.message || "Gagal menyimpan kelas");
        }
    };

    const handleEdit = (classItem) => {
        setEditingClass(classItem);
        setFormData({ name: classItem.name, level: classItem.level });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
            return;
        }
        try {
            await api.delete(`/admin/classes/${id}`);
            alert("Kelas berhasil dihapus");
            fetchClasses();
        } catch (err) {
            console.error("Error deleting class:", err);
            alert(err.response?.data?.message || "Gagal menghapus kelas");
        }
    };

    const openModal = () => {
        setEditingClass(null);
        setFormData({ name: "", level: "" });
        setShowModal(true);
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
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <School className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Kelola Kelas
                                </h1>
                                <p className="text-gray-600">
                                    Tambah, edit, atau hapus data kelas
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            Tambah Kelas
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
                                        Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Kelas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah Siswa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Belum ada data kelas
                                        </td>
                                    </tr>
                                ) : (
                                    classes.map((classItem, index) => (
                                        <tr
                                            key={classItem.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {classItem.level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {classItem.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="text-gray-400" />
                                                    {classItem.studentCount || 0} siswa
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(classItem)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(classItem.id)
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
                <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingClass ? "Edit Kelas" : "Tambah Kelas"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Level
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.level}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            level: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contoh: 10, 11, 12"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Kelas
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contoh: A, B, IPA, IPS"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingClass(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingClass ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}



