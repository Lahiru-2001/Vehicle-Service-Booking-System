import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Filter,
  Eye,
  CalendarDays,
} from "lucide-react";

const PAGE_SIZE = 5;

function formatCurrency(amount) {
  return `Rs.${Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function StatusBadge({ status }) {
  const styles = {
    Approved: "border-[#b6d6ff] bg-[#eaf2ff] text-[#416995]",
    Completed: "border-[#a4f0d0] bg-[#edfff7] text-[#008a63]",
    Pending: "border-[#ffdf87] bg-[#fffaf0] text-[#c36b00]",
    Rejected: "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
        styles[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function RecentBookings({ bookings, searchTerm = "" }) {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All Services");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "All Services" ||
        booking.status.toLowerCase() === statusFilter.toLowerCase();

      const searchableText = [
        booking.id,
        booking.service,
        booking.vehicle,
        booking.date,
        booking.status,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [bookings, statusFilter, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleView = (booking) => {
    setOpenMenu(null);

    navigate("/customer/bookings", {
      state: { bookingId: booking.id },
    });
  };

  const handleReschedule = (booking) => {
    setOpenMenu(null);

    navigate("/customer/bookings", {
      state: {
        bookingId: booking.id,
        action: "reschedule",
      },
    });
  };

  return (
    <section className="overflow-visible rounded-[14px] border border-[#d9dde5] bg-white shadow-[0_1px_1px_rgba(15,23,42,0.02)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[16px] font-extrabold tracking-tight text-[#102338]">
              Recent Bookings
            </h2>

            <span className="rounded-full bg-[#e7efff] px-2 py-1 text-[9px] font-bold text-[#456b99]">
              {bookings.length + 6} Total
            </span>
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[#5d6169]">
            Audit log of your historical services, maintenance invoices, and
            bay status.
          </p>
        </div>

        <div className="relative">
          <Filter
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#586170]"
          />

          <select
            aria-label="Filter bookings by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-[31px] appearance-none rounded-lg border border-[#cbd1dc] bg-[#fafbff] py-1 pl-8 pr-7 text-[11px] text-[#25364c] outline-none focus:border-blue-400"
          >
            <option>All Services</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>

          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
          <thead>
            <tr className="border-y border-[#e1e5ec] bg-[#f3f6fc]">
              <th className="w-[12%] px-4 py-3 text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Booking ID
              </th>
              <th className="w-[22%] px-3 py-3 text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Service
              </th>
              <th className="w-[16%] px-3 py-3 text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Vehicle
              </th>
              <th className="w-[16%] px-3 py-3 text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Date & Time
              </th>
              <th className="w-[15%] px-3 py-3 text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Status
              </th>
              <th className="w-[13%] px-3 py-3 text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Amount
              </th>
              <th className="w-[6%] px-2 py-3 text-center text-[9px] font-bold uppercase tracking-wide text-[#505660]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleBookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-[#e5e7eb] transition hover:bg-[#fafbfe]"
              >
                <td className="px-4 py-4">
                  <span className="text-[10px] font-extrabold text-[#152941]">
                    #{booking.id}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <span className="block text-[11px] font-bold leading-[1.5] text-[#152941]">
                    {booking.service}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <span className="block text-[11px] leading-[1.5] text-[#555a62]">
                    {booking.vehicle}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <span className="block text-[11px] text-[#25364c]">
                    {booking.date}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[#555a62]">
                    {booking.time}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <StatusBadge status={booking.status} />
                </td>

                <td className="px-3 py-4">
                  <span className="whitespace-nowrap text-[11px] font-extrabold text-[#152941]">
                    {formatCurrency(booking.amount)}
                  </span>
                </td>

                <td className="relative px-2 py-4 text-center">
                  <button
                    type="button"
                    aria-label={`Actions for booking ${booking.id}`}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === booking.id ? null : booking.id
                      )
                    }
                    className="rounded-md p-1 text-[#555a62] hover:bg-slate-100"
                  >
                    <EllipsisVertical size={16} />
                  </button>

                  {openMenu === booking.id && (
                    <div className="absolute right-5 top-10 z-20 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
                      <button
                        type="button"
                        onClick={() => handleView(booking)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-slate-700 hover:bg-slate-100"
                      >
                        <Eye size={14} />
                        View details
                      </button>

                      {booking.status !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => handleReschedule(booking)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-slate-700 hover:bg-slate-100"
                        >
                          <CalendarDays size={14} />
                          Reschedule
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {visibleBookings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  No bookings match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f8f9fd] px-4 py-3 sm:px-5">
        <p className="text-[10px] text-[#555a62]">
          Showing{" "}
          {filteredBookings.length === 0
            ? 0
            : (currentPage - 1) * PAGE_SIZE + 1}{" "}
          to {Math.min(currentPage * PAGE_SIZE, filteredBookings.length)} of{" "}
          {filteredBookings.length} logged records
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="flex h-[29px] items-center gap-1 rounded-md border border-[#d5dae3] bg-white px-2 text-[10px] text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={13} />
            Previous
          </button>

          <span className="text-[10px] text-slate-500">
            {currentPage}/{totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
            className="flex h-[29px] items-center gap-1 rounded-md border border-[#cbd1dc] bg-white px-2 text-[10px] text-[#25364c] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}