import { useEffect, useState } from "react";
import api from "../../api";
import {
    Plus,
    Edit,
    Trash2,
    Upload,
    Eye,
    X,
    CheckCircle2,
    BookOpen,
    TrendingUp,
} from "lucide-react";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [bulkClassId, setBulkClassId] = useState("");
    const [bulkFile, setBulkFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        loginIdentifier: "",
        role: "student",
        password: "",
        class_id: "",
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/users");
            // Handle response format dengan success field
            if (res.data.success && res.data.users) {
                setUsers(res.data.users);
            } else if (Array.isArray(res.data)) {
                setUsers(res.data);
            } else {
                setUsers(res.data.users || []);
            }
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await api.get("/admin/classes");
            if (res.data.success && res.data.classes) {
                setClasses(res.data.classes);
            } else if (Array.isArray(res.data)) {
                setClasses(res.data);
            } else {
                setClasses(res.data.classes || []);
            }
        } catch (error) {
            console.error("Gagal mengambil daftar kelas:", error);
            setClasses([]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchClasses();
    }, []);

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!bulkFile || !bulkClassId) {
            alert("Pilih file Excel dan kelas terlebih dahulu");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", bulkFile);
            formData.append("class_id", bulkClassId);

            const res = await api.post("/admin/users/bulk", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                alert(
                    `Berhasil menambahkan ${res.data.created} siswa. Total: ${res.data.total}`
                );
                if (res.data.errors && res.data.errors.length > 0) {
                    console.warn("Errors:", res.data.errors);
                }
                setShowBulkModal(false);
                setBulkFile(null);
                setBulkClassId("");
                fetchUsers();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert(
                error.response?.data?.message ||
                    "Gagal mengupload file. Pastikan format Excel benar (Kolom: Nama, NISN)"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleViewDetail = async (userId) => {
        try {
            const res = await api.get(`/admin/users/${userId}/detail`);
            if (res.data.success) {
                setSelectedUser(userId);
                setUserDetail(res.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            console.error("Error fetching user detail:", error);
            alert("Gagal memuat detail siswa");
        }
    };

    const handleEdit = async (user) => {
        // TODO: Implement edit functionality
        alert("Fitur edit akan segera ditambahkan");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            return;
        }
        try {
            await api.delete(`/admin/users/${id}`);
            alert("User berhasil dihapus");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error.response?.data?.message || "Gagal menghapus user");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const dataToSend = {
            name: newUser.name,
            password: newUser.password,
            role: newUser.role,
        };

        if (newUser.role === "student") {
            dataToSend.nisn = newUser.loginIdentifier;
            if (newUser.class_id) {
                dataToSend.class_id = newUser.class_id;
            } else {
                alert("Kelas wajib diisi untuk siswa.");
                return;
            }
        } else {
            dataToSend.email = newUser.loginIdentifier;
        }
        try {
            await api.post("/admin/users", dataToSend);
            await fetchUsers();
            setNewUser({
                name: "",
                loginIdentifier: "",
                role: "student",
                password: "",
                class_id: "",
            });
        } catch (error) {
            console.error(
                "Gagal menambah pengguna:",
                error.response?.data || error.message
            );
            alert(
                `Gagal menambah pengguna: ${
                    error.response?.data?.message || "Terjadi kesalahan"
                }`
            );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-black">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <Plus className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Kelola Pengguna
                                </h1>
                                <p className="text-gray-600">
                                    Tambah, edit, atau hapus data pengguna
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBulkModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Upload size={20} />
                                Import Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- FORM TAMBAH PENGGUNA --- */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Tambah Pengguna</h2>
                    <form onSubmit={handleAdd} className="flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Nama"
                    value={newUser.name}
                    onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-1"
                    required
                />
                <input
                    type="text"
                    placeholder={newUser.role === "student" ? "NISN" : "Email"}
                    value={newUser.loginIdentifier}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            loginIdentifier: e.target.value,
                        })
                    }
                    className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-1"
                    required
                />
                <select
                    value={newUser.role}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            role: e.target.value,
                            loginIdentifier: "",
                        })
                    }
                    className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                </select>
                {newUser.role === "student" && (
                    <select
                        value={newUser.class_id}
                        onChange={(e) =>
                            setNewUser({ ...newUser, class_id: e.target.value })
                        }
                        className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-1"
                        required
                    >
                        <option value="" disabled>
                            Pilih Kelas
                        </option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.level} - {cls.name}
                            </option>
                        ))}
                    </select>
                )}
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-1"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150"
                >
                    Tambah
                </button>
                    </form>
                </div>

                {/* --- TABEL DAFTAR PENGGUNA --- */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email/NISN
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kelas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.isArray(users) && users.length > 0 ? (
                                    users.map((u, index) => (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {u.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.email || u.nisn || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        u.role === "admin"
                                                            ? "bg-red-100 text-red-800"
                                                            : u.role === "teacher"
                                                            ? "bg-indigo-100 text-indigo-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.role === "student" && u.Class
                                                    ? `${u.Class.level}-${u.Class.name}`
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    {u.role === "student" && (
                                                        <button
                                                            onClick={() =>
                                                                handleViewDetail(u.id)
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(u)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(u.id)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Belum ada data pengguna
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bulk Upload Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Import Siswa dari Excel
                            </h2>
                            <button
                                onClick={() => {
                                    setShowBulkModal(false);
                                    setBulkFile(null);
                                    setBulkClassId("");
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleBulkUpload}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pilih Kelas
                                </label>
                                <select
                                    required
                                    value={bulkClassId}
                                    onChange={(e) =>
                                        setBulkClassId(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Pilih Kelas</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.level} - {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Excel
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Format: Kolom A = Nama, Kolom B = NISN
                                </p>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    required
                                    onChange={(e) =>
                                        setBulkFile(e.target.files[0])
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {bulkFile && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        File: {bulkFile.name}
                                    </p>
                                )}
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Catatan:</strong> Password akan otomatis
                                    dibuat dengan format NISN + "*" (contoh: 1234567890*)
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBulkModal(false);
                                        setBulkFile(null);
                                        setBulkClassId("");
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {uploading ? "Mengupload..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {showDetailModal && userDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                Detail Siswa: {userDetail.user.name}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setUserDetail(null);
                                    setSelectedUser(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">NISN</p>
                                    <p className="font-semibold">
                                        {userDetail.user.nisn || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Kelas</p>
                                    <p className="font-semibold">
                                        {userDetail.user.Class
                                            ? `${userDetail.user.Class.level}-${userDetail.user.Class.name}`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Material Progress */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen size={20} />
                                Progress Belajar
                            </h3>
                            {userDetail.progress && userDetail.progress.length > 0 ? (
                                <div className="space-y-3">
                                    {userDetail.progress.map((progress, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800">
                                                        {progress.material_title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {progress.material_category ===
                                                        "reading"
                                                            ? "Reading"
                                                            : "Listening"}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {progress.is_completed ? (
                                                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                            <CheckCircle2 size={16} />
                                                            Selesai
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                            Sedang dipelajari
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {progress.completed_at && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Selesai:{" "}
                                                    {new Date(
                                                        progress.completed_at
                                                    ).toLocaleDateString("id-ID")}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada progress belajar
                                </div>
                            )}
                        </div>

                        {/* Exercise Attempts */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp size={20} />
                                Nilai Exercise
                            </h3>
                            {userDetail.exercises &&
                            userDetail.exercises.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Materi
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Attempt
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Skor
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Tanggal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {userDetail.exercises.map(
                                                (exercise, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {exercise.material_title}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            #{exercise.attempt_number}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold">
                                                            <span
                                                                className={`${
                                                                    exercise.score !== null
                                                                        ? "text-green-600"
                                                                        : "text-gray-400"
                                                                }`}
                                                            >
                                                                {exercise.score !== null
                                                                    ? exercise.score
                                                                    : "Belum selesai"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {exercise.finished_at
                                                                ? new Date(
                                                                      exercise.finished_at
                                                                  ).toLocaleDateString(
                                                                      "id-ID"
                                                                  )
                                                                : exercise.started_at
                                                                ? new Date(
                                                                      exercise.started_at
                                                                  ).toLocaleDateString(
                                                                      "id-ID"
                                                                  )
                                                                : "N/A"}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada exercise yang dikerjakan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
