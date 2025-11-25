import { useEffect, useState } from "react";
import api from "../../api";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [newUser, setNewUser] = useState({
        name: "",
        loginIdentifier: "",
        role: "student",
        password: "",
        class_id: "",
    });

    const fetchUsers = async () => {
        try {
            // Tidak perlu token di sini, karena middleware otentikasi akan menangani jika perlu
            const res = await api.get("/admin/users");
            // Memastikan data users adalah array, mengatasi potensi format { users: [...] }
            setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            // Opsional: setUsers([]);
        }
    };

    const fetchClasses = async () => {
        try {
            // Asumsi endpoint API untuk daftar kelas adalah /admin/classes
            const res = await api.get("/admin/classes");
            setClasses(res.data.classes || res.data || []);
        } catch (error) {
            console.error("Gagal mengambil daftar kelas:", error);
        }
    };

    useEffect(() => {
        // const token = localStorage.getItem("token"); // Token sudah diatur di `api` instance atau interceptor
        fetchUsers();
        fetchClasses();
    }, []);

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

    return (
        <div className="p-6 text-gray-900 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>

            {/* --- FORM TAMBAH PENGGUNA --- */}
            <form
                onSubmit={handleAdd}
                className="flex gap-2 mb-6 p-4 border rounded-lg shadow-sm bg-gray-50"
            >
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

            {/* --- TABEL DAFTAR PENGGUNA --- */}
            <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-left">
                        <th className="border-b border-gray-200 p-3 font-semibold">
                            Nama
                        </th>
                        <th className="border-b border-gray-200 p-3 font-semibold">
                            Email/NISN
                        </th>
                        <th className="border-b border-gray-200 p-3 font-semibold">
                            Role
                        </th>
                        <th className="border-b border-gray-200 p-3 font-semibold">
                            Kelas
                        </th>
                        <th className="border-b border-gray-200 p-3 font-semibold">
                            Nama Kelas
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((u) => (
                            <tr
                                key={u.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="border-b border-gray-200 p-3">
                                    {u.name}
                                </td>
                                <td className="border-b border-gray-200 p-3 font-medium">
                                    {/* LOGIKA PERBAIKAN: Jika email ada, tampilkan email. Jika tidak, tampilkan NISN. */}
                                    {u.email || u.nisn || "N/A"}
                                </td>
                                <td className="border-b border-gray-200 p-3 capitalize">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                            u.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : u.role === "guru"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-green-100 text-green-800"
                        }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="border-b border-gray-200 p-3">
                                    {u.role === "student"
                                        ? `${u.Class.level}`
                                        : u.role !== "student"
                                        ? "—"
                                        : "Belum ditetapkan"}
                                </td>
                                <td className="border-b border-gray-200 p-3">
                                    {u.Class
                                        ? `${u.Class.name}`
                                        : u.role !== "student"
                                        ? "—"
                                        : "Belum ditetapkan"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="3"
                                className="text-center p-4 text-gray-500"
                            >
                                Belum ada data pengguna
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
