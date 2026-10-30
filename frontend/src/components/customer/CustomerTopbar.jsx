import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CircleHelp,
  Bell,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";
import { customer } from "../../data/customerDashboardData";

export default function CustomerTopbar({ onSearch }) {
  const [search, setSearch] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const updateSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[53px] flex-wrap items-center justify-between gap-3 border-b border-[#dce0e6] bg-white px-4 py-2 sm:px-6 lg:px-[26px]">
      <div className="flex items-center gap-2 pl-10 text-[11px] sm:pl-0 sm:text-xs">
        <span className="text-[#565b64]">Customer Portal</span>
        <span className="text-slate-400">/</span>
        <span className="font-bold text-[#142943]">Overview</span>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
        <div className="relative hidden min-w-[150px] max-w-[335px] flex-1 sm:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#626b78]"
          />

          <input
            value={search}
            onChange={updateSearch}
            placeholder="Search bookings, invoices, vehicles..."
            aria-label="Search bookings, invoices and vehicles"
            className="h-[34px] w-full rounded-lg border border-[#cbd1dc] bg-[#f8f9fc] pl-8 pr-3 text-[11px] text-[#26364b] outline-none focus:border-[#769ac5] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <Link
          to="/customer/support"
          className="inline-flex items-center gap-1 text-[11px] text-[#4e535b] hover:text-[#ff681c]"
        >
          <CircleHelp size={14} />
          <span className="hidden md:inline">Support</span>
        </Link>

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((value) => !value)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#4c535c] hover:bg-slate-100"
          >
            <Bell size={17} />

            <span className="absolute right-[7px] top-[5px] h-[6px] w-[6px] rounded-full bg-[#ff681c]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <p className="text-sm font-bold text-slate-800">
                Notifications
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Your BMW service is scheduled. Check your upcoming appointment
                for details.
              </p>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="mt-3 text-xs font-semibold text-blue-700"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="relative border-l border-[#e0e3e9] pl-3">
          <button
            type="button"
            onClick={() => setAccountOpen((value) => !value)}
            className="flex items-center gap-2 text-left"
          >
            <span className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-[#0b2035] text-[10px] font-bold text-white">
              {customer.initials}
            </span>

            <span className="hidden leading-tight md:block">
              <span className="block max-w-[140px] truncate text-[11px] font-bold text-[#152941]">
                {customer.fullName}
              </span>
              <span className="block text-[9px] font-semibold text-[#ff681c]">
                {customer.membership}
              </span>
            </span>

            <ChevronDown size={13} className="text-slate-500" />
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
              <Link
                to="/customer/profile"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100"
              >
                <UserRound size={15} />
                My Profile
              </Link>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("autocare_token");
                  localStorage.removeItem("autocare_user");
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}