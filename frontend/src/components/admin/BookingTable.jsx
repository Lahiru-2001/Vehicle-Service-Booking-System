
import {
  Clock3,
  MoreVertical,
  Check,
  X,
  Eye,
  Wrench,
} from "lucide-react";

const statusStyles = {
  "PENDING APPROVAL":
    "bg-orange-50 text-orange-700 border-orange-200",

  "APPROVED / SCHEDULED":
    "bg-blue-50 text-blue-700 border-blue-200",

  "IN-PROGRESS":
    "bg-purple-50 text-purple-700 border-purple-200",

  "FINAL CHECK":
    "bg-blue-50 text-blue-700 border-blue-200",

  COMPLETED:
    "bg-green-50 text-green-700 border-green-200",

  REJECTED:
    "bg-red-50 text-red-700 border-red-200",

  CANCELLED:
    "bg-red-50 text-red-700 border-red-200",
};

export default function BookingTable({
  bookings,
  selectedBooking,
  setSelectedBooking,
  selectedIds,
  setSelectedIds,
  onApprove,
  onReject,
  page,
  setPage,
  totalBookings,
  pageSize = 6,
}) {
  const pageCount = Math.max(1, Math.ceil(totalBookings / pageSize));

  const toggleSelect = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleAll = () => {
    const allSelected =
      bookings.length > 0 &&
      bookings.every((booking) =>
        selectedIds.includes(booking.id)
      );

    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) => !bookings.some((booking) => booking.id === id)
        )
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...bookings.map((booking) => booking.id),
        ]),
      ]);
    }
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* TABLE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[11px] font-extrabold text-[#172c43]">
            Showing Active Worklist:
          </h2>

          <span className="text-[10px] text-slate-500">
            {bookings.length} bookings requiring action
          </span>
        </div>

        <p className="text-[9px] text-slate-400">
          Sort by: <strong className="text-slate-600">
            Scheduled Time (Ascending)
          </strong>
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
              <th className="w-9 px-3 py-3">
                <input
                  type="checkbox"
                  checked={
                    bookings.length > 0 &&
                    bookings.every((b) =>
                      selectedIds.includes(b.id)
                    )
                  }
                  onChange={toggleAll}
                  className="accent-orange-500"
                  aria-label="Select all bookings"
                />
              </th>
              <th className="px-2 py-3">Booking ID</th>
              <th className="px-2 py-3">Customer & Contact</th>
              <th className="px-2 py-3">Vehicle & Plate</th>
              <th className="px-2 py-3">Service Package</th>
              <th className="px-2 py-3">Scheduled & Bay</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => {
              const isSelected =
                selectedBooking?.id === booking.id;

              return (
                <tr
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`cursor-pointer transition hover:bg-orange-50/50 ${
                    isSelected
                      ? "bg-amber-50/70"
                      : "bg-white"
                  }`}
                >
                  {/* CHECKBOX */}
                  <td className="border-l-2 border-transparent px-3 py-4"
                    style={{
                      borderLeftColor: isSelected
                        ? "#ff711f"
                        : "transparent",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(booking.id)}
                      onChange={() => toggleSelect(booking.id)}
                      className="accent-orange-500"
                      aria-label={`Select ${booking.id}`}
                    />
                  </td>

                  {/* BOOKING ID */}
                  <td className="px-2 py-4">
                    <span className="text-[9px] font-extrabold text-[#172c43]">
                      #{booking.id}
                    </span>

                    {booking.status === "PENDING APPROVAL" && (
                      <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
                    )}
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-2 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#153c5c] text-[9px] font-bold text-white">
                        {booking.initials}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[115px] text-[9px] font-bold text-[#172c43]">
                          {booking.customer}
                        </p>

                        <p className="mt-1 text-[8px] text-slate-400">
                          {booking.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-2 py-4">
                    <p className="max-w-[110px] text-[9px] font-semibold text-[#172c43]">
                      {booking.vehicle}
                    </p>

                    <p className="mt-1 inline-block rounded bg-slate-100 px-1 py-0.5 text-[8px] text-slate-500">
                      {booking.plate}
                    </p>
                  </td>

                  {/* SERVICE */}
                  <td className="px-2 py-4">
                    <p className="max-w-[140px] text-[9px] font-semibold text-[#172c43]">
                      {booking.service}
                    </p>

                    <p className="mt-1 text-[8px] text-slate-400">
                      Rs.{booking.amount.toLocaleString("en-US")}
                      {" "} (Est. {booking.duration})
                    </p>
                  </td>

                  {/* SCHEDULE */}
                  <td className="px-2 py-4">
                    <p className="flex items-center gap-1 text-[9px] font-semibold text-[#172c43]">
                      <Clock3 size={10} className="text-slate-400" />
                      {booking.time}
                    </p>

                    <p className="mt-1 max-w-[110px] text-[8px] text-slate-500">
                      {booking.bay}
                    </p>

                    <p className={`mt-1 text-[8px] ${
                      booking.technician === "Unassigned"
                        ? "text-orange-600"
                        : "text-slate-400"
                    }`}>
                      {booking.technician}
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="px-2 py-4">
                    <span className={`whitespace-nowrap rounded-full border px-2 py-1 text-[8px] font-bold ${
                      statusStyles[booking.status] ||
                      "border-slate-200 bg-slate-50 text-slate-600"
                    }`}>
                      {booking.status === "PENDING APPROVAL"
                        ? "PENDING"
                        : booking.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td
                    className="px-2 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      {booking.status === "PENDING APPROVAL" ? (
                        <>
                          <button
                            onClick={() => onApprove(booking.id)}
                            className="rounded bg-orange-500 px-2 py-1.5 text-[8px] font-bold text-white hover:bg-orange-600"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => onReject(booking.id)}
                            className="rounded p-1 text-red-500 hover:bg-red-50"
                            title="Reject booking"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          {booking.status === "COMPLETED"
                            ? "Invoice"
                            : booking.status === "IN-PROGRESS"
                              ? "Bay Cam"
                              : "View"}
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        onClick={() =>
                          setSelectedBooking(booking)
                        }
                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                        title="More actions"
                      >
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-14 text-center text-xs text-slate-500"
                >
                  <Wrench className="mx-auto mb-2 text-slate-300" size={24} />
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-3 py-3">
        <p className="text-[9px] text-slate-500">
          Showing {bookings.length ? (page - 1) * pageSize + 1 : 0}
          {" "}to {(page - 1) * pageSize + bookings.length}
          {" "}of {totalBookings} bookings
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-slate-200 px-2 py-1.5 text-[9px] text-slate-500 disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1)
            .filter((p) =>
              p === 1 ||
              p === pageCount ||
              Math.abs(p - page) <= 1
            )
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded border px-2.5 py-1.5 text-[9px] ${
                  page === p
                    ? "border-[#102b43] bg-[#102b43] text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

          <button
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-slate-200 px-2 py-1.5 text-[9px] text-slate-500 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
