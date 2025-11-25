import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 pl-64">
            <Sidebar />
            {/* Konten Utama */}
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
