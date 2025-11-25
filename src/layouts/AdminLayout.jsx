import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 pl-64">
            <AdminSidebar />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
