
import { useLocation } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

const pageNames = {
  dashboard: "Workshop Overview & Analytics",
  bookings: "Booking Management",
  "service-categories": "Service Categories",
  customers: "Customer Management",
  settings: "Workshop Settings",
};

export default function AdminNavbar() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage =
    location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex min-h-[66px] flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:px-7">
      <div className="flex items-center gap-2 pl-12 lg:pl-0">
        <span className="text-[11px] text-slate-500">
          Admin Portal
        </span>

        <ChevronRight size={12} className="text-slate-400" />

        <h1 className="text-[12px] font-bold text-[#152b43]">
          {pageNames[currentPage] || "Admin Portal"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5">
          <CalendarDays size={14} className="text-slate-500" />

          <span className="text-[10px] font-medium text-slate-600">
            Today, {today}
          </span>

          <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-orange-600">
            Live Shift
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={17} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-800">
                Notifications
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                You have 5 pending booking approvals.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                One workshop bay is available.
              </p>
            </div>
          )}
        </div>

        <button
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          title="Help"
        >
          <HelpCircle size={17} />
        </button>
      </div>
    </header>
  );
}
