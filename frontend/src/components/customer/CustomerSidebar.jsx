import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  CarFront,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { customer } from "../../data/customerDashboardData";

const navigation = [
  {
    label: "Dashboard",
    path: "/customer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Book a Service",
    path: "/customer/book-service",
    icon: CalendarPlus,
  },
  {
    label: "My Bookings",
    path: "/customer/bookings",
    icon: CarFront,
    badge: 3,
  },
  {
    label: "My Profile",
    path: "/customer/profile",
    icon: UserRound,
  },
];

export default function CustomerSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("autocare_token");
    localStorage.removeItem("autocare_user");

    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
      >
        <Menu size={21} />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[212px] flex-col border-r border-[#d4d8df] bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[64px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex h-[36px] w-full items-center gap-2 rounded-lg bg-[#e5e9ee] px-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0c2237]">
              <span className="text-sm font-black text-[#ff681c]">A</span>
            </div>

            <div className="leading-tight">
              <p className="text-[13px] font-extrabold tracking-tight text-[#102338]">
                Auto<span className="text-[#ff681c]">Care</span>
              </p>
              <p className="text-[6px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Service & Repair
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-2 text-slate-500 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-[14px] py-6">
          {navigation.map(({ label, path, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex h-[34px] items-center gap-2.5 rounded-lg px-2.5 text-[12px] transition ${
                  isActive
                    ? "bg-[#b4d5ff] font-semibold text-[#345a80]"
                    : "text-[#4f535a] hover:bg-slate-100"
                }`
              }
            >
              <Icon size={16} strokeWidth={2} />

              <span className="flex-1">{label}</span>

              {badge && (
                <span className="flex h-[17px] min-w-[18px] items-center justify-center rounded-full bg-[#e3edff] px-1 text-[10px] text-[#365b8a]">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#e2e5e9] p-[14px]">
          <div className="flex items-center gap-2 rounded-lg border border-[#dce4f1] bg-[#eff4ff] p-2">
            <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-[#0b2035] text-[10px] font-bold text-white">
              {customer.initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#152941]">
                {customer.fullName}
              </p>
              <p className="text-[9px] text-[#606a78]">
                {customer.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex h-8 w-full items-center gap-2 rounded-md px-2 text-[12px] text-[#555a62] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}