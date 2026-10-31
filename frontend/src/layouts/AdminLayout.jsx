
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminFooter from "../components/admin/AdminFooter";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f2f5fa]">
      <AdminSidebar />

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[240px]">
        <AdminNavbar />

        <main className="flex-1 p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
