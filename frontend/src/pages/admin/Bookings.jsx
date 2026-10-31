
import { useMemo, useState } from "react";
import {
  Settings2,
  Download,
  X,
  CalendarClock,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  ClipboardList,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

import api from "../../api/client";

import {
  initialBookings,
  bookingTabs,
} from "../../data/adminBookingsData";

import BookingStatCard from "../../components/admin/BookingStatCard";
import BookingFilters from "../../components/admin/BookingFilters";
import BookingTable from "../../components/admin/BookingTable";
import BookingDetailsPanel from "../../components/admin/BookingDetailsPanel";

const PAGE_SIZE = 6;

const initialStats = [
  {
    title: "TOTAL BOOKINGS",
    value: "148",
    subtitle: "All time records",
    badge: "All bookings",
    icon: "bookings",
    color: "blue",
  },
  {
    title: "PENDING REVIEW",
    value: "8",
    subtitle: "Requires attention",
    badge: "Action Needed",
    icon: "pending",
    color: "orange",
  },
  {
    title: "SCHEDULED TODAY",
    value: "24",
    subtitle: "Appointments confirmed",
    badge: "Bay Assigned",
    icon: "scheduled",
    color: "blue",
  },
  {
    title: "IN SERVICE",
    value: "6",
    subtitle: "Vehicles in workshop",
    badge: "Bays 1-6 Live",
    icon: "service",
    color: "purple",
  },
  {
    title: "COMPLETED TODAY",
    value: "18",
    subtitle: "Successfully completed",
    badge: "100% On-Time",
    icon: "completed",
    color: "green",
  },
  {
    title: "CANCELLED / REJECTED",
    value: "3",
    subtitle: "Last 7 days",
    badge: "Last 7 Days",
    icon: "cancelled",
    color: "red",
  },
];

const statusForTab = {
  "Pending Approval": ["PENDING APPROVAL"],
  "Approved / Scheduled": ["APPROVED / SCHEDULED"],
  "In Progress": ["IN-PROGRESS", "FINAL CHECK"],
  Completed: ["COMPLETED"],
  "Rejected / Cancelled": ["REJECTED", "CANCELLED"],
};

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const [selectedBooking, setSelectedBooking] = useState(
    initialBookings[0]
  );

  const [selectedIds, setSelectedIds] = useState([
    initialBookings[0].id,
  ]);

  const [activeTab, setActiveTab] = useState("Pending Approval");

  const [search, setSearch] = useState("");
  const [service, setService] = useState("All Services");
  const [bay, setBay] = useState("All Bays");
  const [technician, setTechnician] = useState("All Technicians");
  const [dateRange, setDateRange] = useState("");

  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [showSettings, setShowSettings] = useState(false);

  // --------------------------------
  // STATUS MESSAGE
  // --------------------------------

  const notify = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // --------------------------------
  // FILTER BOOKINGS
  // --------------------------------

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (activeTab !== "All Bookings") {
      const statuses = statusForTab[activeTab] || [];

      result = result.filter((booking) =>
        statuses.includes(booking.status)
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((booking) =>
        [
          booking.id,
          booking.customer,
          booking.phone,
          booking.vehicle,
          booking.plate,
          booking.service,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (service !== "All Services") {
      const searchService = service.toLowerCase();

      result = result.filter((booking) =>
        booking.service.toLowerCase().includes(
          searchService.replace(" service", "")
        )
      );
    }

    if (bay !== "All Bays") {
      result = result.filter((booking) =>
        booking.bay.toLowerCase().includes(bay.toLowerCase())
      );
    }

    if (technician !== "All Technicians") {
      result = result.filter((booking) =>
        booking.technician.toLowerCase().includes(
          technician.toLowerCase()
        )
      );
    }

    if (dateRange) {
      result = result.filter(
        (booking) => booking.date === dateRange
      );
    }

    return result;
  }, [
    bookings,
    activeTab,
    search,
    service,
    bay,
    technician,
    dateRange,
  ]);

  // --------------------------------
  // TAB COUNTS
  // --------------------------------

  const counts = useMemo(() => {
    return {
      "All Bookings": bookings.length,

      "Pending Approval": bookings.filter(
        (b) => b.status === "PENDING APPROVAL"
      ).length,

      "Approved / Scheduled": bookings.filter(
        (b) => b.status === "APPROVED / SCHEDULED"
      ).length,

      "In Progress": bookings.filter(
        (b) =>
          b.status === "IN-PROGRESS" ||
          b.status === "FINAL CHECK"
      ).length,

      Completed: bookings.filter(
        (b) => b.status === "COMPLETED"
      ).length,

      "Rejected / Cancelled": bookings.filter(
        (b) =>
          b.status === "REJECTED" ||
          b.status === "CANCELLED"
      ).length,
    };
  }, [bookings]);

  // --------------------------------
  // PAGINATION
  // --------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // --------------------------------
  // APPROVE BOOKING
  // --------------------------------

  const handleApprove = async (id) => {
    const booking = bookings.find((item) => item.id === id);

    if (!booking) return;

    try {
      // Backend route must support this request.
      await api.patch(`/bookings/${id}/status`, {
        status: "APPROVED / SCHEDULED",
      });

      updateBooking(id, {
        status: "APPROVED / SCHEDULED",
      });

      notify(`Booking ${id} approved successfully.`);
    } catch (error) {
      if (!error.response) {
        notify(
          `Backend unavailable. Booking ${id} was not changed.`,
          "error"
        );
      } else {
        notify(
          error.response?.data?.message ||
            "Unable to approve this booking.",
          "error"
        );
      }
    }
  };

  // --------------------------------
  // REJECT BOOKING
  // --------------------------------

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to reject booking ${id}?`
    );

    if (!confirmed) return;

    try {
      await api.patch(`/bookings/${id}/status`, {
        status: "REJECTED",
      });

      updateBooking(id, {
        status: "REJECTED",
      });

      notify(`Booking ${id} rejected successfully.`);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to reject booking. Check your backend API.",
        "error"
      );
    }
  };

  // --------------------------------
  // UPDATE BOOKING
  // --------------------------------

  const updateBooking = (id, changes) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? { ...booking, ...changes }
          : booking
      )
    );

    setSelectedBooking((previous) =>
      previous?.id === id
        ? { ...previous, ...changes }
        : previous
    );

    setSelectedIds((previous) =>
      previous.filter((item) => item !== id)
    );
  };

  // --------------------------------
  // BATCH APPROVAL
  // --------------------------------

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) {
      notify("Please select bookings first.", "error");
      return;
    }

    const pending = bookings.filter(
      (booking) =>
        selectedIds.includes(booking.id) &&
        booking.status === "PENDING APPROVAL"
    );

    if (pending.length === 0) {
      notify("No pending bookings selected.", "error");
      return;
    }

    const confirmed = window.confirm(
      `Approve ${pending.length} selected bookings?`
    );

    if (!confirmed) return;

    let succeeded = 0;

    for (const booking of pending) {
      try {
        await api.patch(
          `/bookings/${booking.id}/status`,
          { status: "APPROVED / SCHEDULED" }
        );

        updateBooking(booking.id, {
          status: "APPROVED / SCHEDULED",
        });

        succeeded++;
      } catch (error) {
        console.error(
          `Failed to approve ${booking.id}`,
          error
        );
      }
    }

    notify(
      `${succeeded} of ${pending.length} bookings approved.`,
      succeeded === pending.length ? "success" : "error"
    );
  };

  // --------------------------------
  // BAY AND TECHNICIAN ALLOCATION
  // --------------------------------

  const handleAssign = async (id, selectedBay, selectedTech) => {
    try {
      await api.patch(`/bookings/${id}/allocation`, {
        bay: selectedBay,
        technician: selectedTech,
      });

      updateBooking(id, {
        bay: selectedBay,
        technician: selectedTech,
      });

      notify("Workshop resources allocated successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to save allocation. Check your backend API.",
        "error"
      );
    }
  };

  // --------------------------------
  // RESCHEDULE
  // --------------------------------

  const openReschedule = (booking) => {
    setNewDate(booking.date);
    setNewTime(booking.time);
    setRescheduleBooking(booking);
  };

  const saveReschedule = async (event) => {
    event.preventDefault();

    if (!rescheduleBooking || !newDate || !newTime) {
      return;
    }

    try {
      await api.patch(
        `/bookings/${rescheduleBooking.id}/reschedule`,
        {
          date: newDate,
          time: newTime,
        }
      );

      updateBooking(rescheduleBooking.id, {
        date: newDate,
        time: newTime,
      });

      notify("Booking rescheduled successfully.");
      setRescheduleBooking(null);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to reschedule booking. Check your backend API.",
        "error"
      );
    }
  };

  // --------------------------------
  // EXPORT CSV
  // --------------------------------

  const handleExport = () => {
    const headers = [
      "Booking ID",
      "Customer",
      "Phone",
      "Vehicle",
      "Plate",
      "Service",
      "Bay",
      "Technician",
      "Date",
      "Time",
      "Amount",
      "Status",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredBookings.map((b) => [
      b.id,
      b.customer,
      b.phone,
      b.vehicle,
      b.plate,
      b.service,
      b.bay,
      b.technician,
      b.date,
      b.time,
      b.amount,
      b.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "autocare-bookings.csv";
    link.click();

    URL.revokeObjectURL(url);

    notify("Booking report exported successfully.");
  };

  // --------------------------------
  // STATISTICS
  // --------------------------------

  const stats = initialStats;

  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-3">

      {/* PAGE HEADING */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#172c43] sm:text-2xl">
            Booking Management
          </h1>

          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
            Review, schedule, assign bays, and dispatch vehicle
            service appointments across workshop bays.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Settings2 size={13} />
            View Settings
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Download size={13} />
            Export Report
          </button>
        </div>
      </div>

      {/* SETTINGS PANEL */}
      {showSettings && (
        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div>
            <p className="text-xs font-bold text-blue-800">
              Booking Management Settings
            </p>
            <p className="mt-1 text-[10px] text-blue-600">
              Workshop configuration can be managed from the Settings page.
            </p>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="text-blue-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <BookingStatCard key={stat.title} stat={stat} />
        ))}
      </section>

      {/* FILTERS */}
      <BookingFilters
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        activeTab={activeTab}
        setActiveTab={(value) => {
          setActiveTab(value);
          setPage(1);
        }}
        tabs={bookingTabs}
        counts={counts}
        service={service}
        setService={(value) => {
          setService(value);
          setPage(1);
        }}
        bay={bay}
        setBay={(value) => {
          setBay(value);
          setPage(1);
        }}
        technician={technician}
        setTechnician={(value) => {
          setTechnician(value);
          setPage(1);
        }}
        dateRange={dateRange}
        setDateRange={(value) => {
          setDateRange(value);
          setPage(1);
        }}
        onBatchApprove={handleBatchApprove}
        onExport={handleExport}
        selectedCount={selectedIds.length}
      />

      {/* NOTIFICATION */}
      {message && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-lg border p-3 text-[11px] ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span className="flex items-center gap-2">
            {messageType === "success" ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}
            {message}
          </span>

          <button onClick={() => setMessage("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* TABLE + DETAILS */}
      <section className="grid min-w-0 grid-cols-1 items-start gap-3 2xl:grid-cols-[1.65fr_1fr]">
        <BookingTable
          bookings={paginatedBookings}
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onApprove={handleApprove}
          onReject={handleReject}
          page={currentPage}
          setPage={setPage}
          totalBookings={filteredBookings.length}
          pageSize={PAGE_SIZE}
        />

        <BookingDetailsPanel
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onAssign={handleAssign}
          onReschedule={openReschedule}
        />
      </section>

      {/* RESCHEDULE MODAL */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#172c43]">
                Reschedule Booking
              </h2>

              <button
                onClick={() => setRescheduleBooking(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Booking Reference: #{rescheduleBooking.id}
            </p>

            <form
              onSubmit={saveReschedule}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  New Appointment Date
                </label>

                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  New Appointment Time
                </label>

                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#ff711f] py-2.5 text-xs font-bold text-white hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
