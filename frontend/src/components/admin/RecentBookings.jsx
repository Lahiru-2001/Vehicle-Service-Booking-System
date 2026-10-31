
import { useMemo, useState } from "react";
import {
  Check,
  X,
  ExternalLink,
  Receipt,
  MoreVertical,
  Activity,
} from "lucide-react";
import api from "../../api/client";
import {
  bookings as initialBookings,
  bookingFilters,
} from "../../data/adminDashboardData";

const statusStyles = {
  "PENDING APPROVAL": "bg-orange-50 text-orange-700 border-orange-200",
  "IN-PROGRESS": "bg-blue-50 text-blue-700 border-blue-200",
  "FINAL CHECK": "bg-orange-50 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
};

export default function RecentBookings() {
  const [rows, setRows] = useState(initialBookings);
  const [filter, setFilter] = useState("All Recent");
  const [message, setMessage] = useState("");

  const filteredBookings = useMemo(() => {
    if (filter === "Pending Approval") {
      return rows.filter((b) => b.status === "PENDING APPROVAL");
    }

    if (filter === "Active In-Bay") {
      return rows.filter(
        (b) =>
          b.status === "IN-PROGRESS" ||
          b.status === "FINAL CHECK"
      );
    }

    if (filter === "Completed") {
      return rows.filter((b) => b.status === "COMPLETED");
    }

    return rows;
  }, [filter, rows]);

  const updateBooking = async (id, action) => {
    const newStatus =
      action === "approve" ? "IN-PROGRESS" : "REJECTED";

    try {
      // Connect this endpoint to your backend booking routes.
      // The dashboard updates locally if the API is not yet configured.
      await api.patch(`/bookings/${id}/status`, {
        status: newStatus,
      });

      setRows((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      setMessage(
        action === "approve"
          ? `Booking ${id} approved successfully.`
          : `Booking ${id} rejected.`
      );
    } catch (error) {
      // Demo fallback: useful before connecting the backend.
      if (!error.response) {
        setRows((previous) =>
          previous.map((booking) =>
            booking.id === id
              ? { ...booking, status: newStatus }
              : booking
          )
        );

        setMessage(
          action === "approve"
            ? `Booking ${id} approved in demo mode.`
            : `Booking ${id} rejected in demo mode.`
        );
      } else {
        setMessage(
          error.response?.data?.message ||
          "Unable to update this booking."
        );
      }
    }
  };

  const pendingCount = rows.filter(
    (booking) => booking.status === "PENDING APPROVAL"
  ).length;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[13px] font-bold text-[#172c43]">
            Recent Bookings & Rapid Dispatch
          </h2>

          <span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-bold text-orange-700">
            {pendingCount} Awaiting Approval
          </span>
        </div>

        <p className="mt-1 text-[10px] text-slate-500">
          Review incoming fleet appointments, allocate technician bays,
          or confirm quotes.
        </p>

        {/* FILTER BUTTONS */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {bookingFilters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-md border px-2.5 py-1.5 text-[9px] font-semibold transition ${
                filter === item
                  ? "border-slate-300 bg-slate-50 text-[#172c43]"
                  : "border-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item}
              {item === "Pending Approval" &&
                ` (${pendingCount})`}
            </button>
          ))}

          <button
            onClick={() => setMessage("Batch approval requires backend configuration.")}
            className="ml-auto flex items-center gap-1 rounded-md bg-[#102b43] px-3 py-1.5 text-[9px] font-semibold text-white hover:bg-[#1b4262]"
          >
            <Check size={11} />
            Batch Approve
          </button>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2 text-[10px] text-blue-700"
        >
          {message}
          <button onClick={() => setMessage("")} aria-label="Dismiss message">
            <X size={13} />
          </button>
        </div>
      )}

      {/* RESPONSIVE TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead>
            <tr className="bg-[#f7f9fc] text-[8px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3">Booking ID</th>
              <th className="px-3 py-3">Customer & Contact</th>
              <th className="px-3 py-3">Vehicle Details</th>
              <th className="px-3 py-3">Service Package</th>
              <th className="px-3 py-3">Bay & Tech</th>
              <th className="px-3 py-3">Scheduled Time</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Quick Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-3 py-4">
                  <span className="text-[9px] font-bold text-[#172c43]">
                    #{booking.id}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#214a6b] text-[9px] font-bold text-white">
                      {booking.initials}
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-[#172c43]">
                        {booking.customer}
                      </p>
                      <p className="mt-1 text-[8px] text-slate-400">
                        {booking.phone}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-4">
                  <p className="max-w-[115px] text-[9px] font-semibold text-[#172c43]">
                    {booking.vehicle}
                  </p>
                  <p className="mt-1 text-[8px] text-slate-400">
                    {booking.plate}
                  </p>
                </td>

                <td className="px-3 py-4">
                  <p className="max-w-[125px] text-[9px] font-semibold text-[#172c43]">
                    {booking.service}
                  </p>
                  <p className="mt-1 max-w-[125px] text-[8px] text-slate-400">
                    {booking.package}
                  </p>
                </td>

                <td className="px-3 py-4">
                  <p className="text-[9px] font-medium text-[#172c43]">
                    {booking.bay}
                  </p>
                  <p className="mt-1 text-[8px] text-slate-400">
                    {booking.technician}
                  </p>
                </td>

                <td className="px-3 py-4">
                  <p className="text-[9px] font-medium text-[#172c43]">
                    {booking.time}
                  </p>
                  <p className="mt-1 text-[8px] text-green-600">
                    {booking.duration}
                  </p>
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`whitespace-nowrap rounded-full border px-2 py-1 text-[8px] font-bold ${
                      statusStyles[booking.status] ||
                      "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center gap-1.5">
                    {booking.status === "PENDING APPROVAL" ? (
                      <>
                        <button
                          onClick={() =>
                            updateBooking(booking.id, "approve")
                          }
                          className="rounded bg-green-600 px-2 py-1.5 text-[8px] font-bold text-white hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateBooking(booking.id, "reject")
                          }
                          className="rounded border border-red-200 px-2 py-1.5 text-[8px] font-semibold text-red-600 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : booking.status === "IN-PROGRESS" ? (
                      <button
                        onClick={() =>
                          setMessage(`Telemetry for ${booking.id} is not connected yet.`)
                        }
                        className="rounded border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-[#172c43] hover:bg-slate-50"
                      >
                        <Activity size={10} className="mr-1 inline" />
                        Telemetry
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setMessage(`Receipt for ${booking.id} is not configured yet.`)
                        }
                        className="rounded border border-slate-200 px-2 py-1.5 text-[8px] font-semibold text-[#172c43] hover:bg-slate-50"
                      >
                        <Receipt size={10} className="mr-1 inline" />
                        Receipt
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setMessage(`Booking details: ${booking.id}`)
                      }
                      title="View booking"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-orange-600"
                    >
                      <ExternalLink size={12} />
                    </button>

                    <button
                      onClick={() =>
                        setMessage(`More actions for ${booking.id}`)
                      }
                      title="More actions"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <MoreVertical size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-10 text-center text-xs text-slate-500"
                >
                  No bookings found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
        <p className="text-[9px] text-slate-500">
          Showing 1 to {filteredBookings.length} of 24 work orders today
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled
            className="rounded border border-slate-200 px-2 py-1 text-[9px] text-slate-400"
          >
            Previous
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() =>
                setMessage(`Page ${page} requires backend pagination.`)
              }
              className={`rounded border px-2.5 py-1 text-[9px] ${
                page === 1
                  ? "border-[#102b43] bg-[#102b43] text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setMessage("Next page requires backend pagination.")}
            className="rounded border border-slate-200 px-2 py-1 text-[9px] text-slate-600"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
