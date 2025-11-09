import { useEffect, useState } from "react";
import api from "../../api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/admin/users").then((res) => {
      // Jika API mengembalikan { users: [...] }
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await api.post("/admin/users", newUser);
    const res = await api.get("/admin/users");
    setUsers(res.data);
    setNewUser({ name: "", email: "", role: "student", password: "" });
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nama"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Email / NISN"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2"
        >
          <option value="admin">Admin</option>
          <option value="teacher">Guru</option>
          <option value="student">Siswa</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Email/NISN</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2 capitalize">{u.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">
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
