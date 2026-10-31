
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Settings,
  Users,
  Wrench,
  LogOut,
  Menu,
  X,
  CarFront,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    name: "Service Categories",
    path: "/admin/service-categories",
    icon: Wrench,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("autocare_token");
    localStorage.removeItem("autocare_user");
    navigate("/login", { replace: true });
  };

  const user = JSON.parse(
    localStorage.getItem("autocare_user") || "{}"
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#0b2035] p-2 text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-[#0b2035] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* BRAND */}
        <div className="flex h-[70px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff711f]">
              <Wrench size={20} />
            </div>

            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight">
                AutoCare
                <span className="ml-1 rounded bg-[#ff711f] px-1 py-0.5 text-[8px] text-white">
                  PRO
                </span>
              </h2>
              <p className="text-[9px] text-slate-400">
                OPS - Enterprise Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] font-medium transition ${
                    isActive
                      ? "bg-[#164568] text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* USER PROFILE */}
        <div className="border-t border-white/10 p-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-400 bg-[#193c55] text-[11px] font-bold text-orange-400">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold">
                {user.name || "Admin User"}
              </p>
              <p className="text-[9px] text-slate-400">
                Workshop Ops Director
              </p>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="ml-auto text-slate-400 hover:text-orange-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
