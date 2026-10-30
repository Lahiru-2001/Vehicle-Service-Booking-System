import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Download,
  FileText,
  Filter,
  LayoutGrid,
  List,
  LoaderCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  X,
} from "lucide-react";

import api from "../../api/client";

/* -------------------------------------------------------
   DEMONSTRATION DATA
   Displayed when the booking API is not yet implemented.
------------------------------------------------------- */

const SAMPLE_BOOKINGS = [
  {
    id: "AC-8924",
    service: "Comprehensive Brake Service & Fluid Flush",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2025-10-25",
    time: "02:30 PM",
    status: "Approved",
    amount: 6500,
    workshop: "Bay 3",
    technician: "Master Tech David Miller",
    progress: "Check-in",
    notes: "",
  },
  {
    id: "AC-8910",
    service: "Full Synthetic Oil Change & Filter",
    vehicle: "2023 Toyota RAV4 Prime",
    plate: "WP CAD-1205",
    date: "2025-10-28",
    time: "10:00 AM",
    status: "Pending Approval",
    amount: 6500,
    workshop: "Bay 1",
    technician: "Technician not assigned",
    progress: "Approved",
    notes: "",
  },
  {
    id: "AC-8751",
    service: "40,000 km Major Service & Diagnostics",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2025-10-10",
    time: "09:00 AM",
    status: "Completed",
    amount: 6500,
    workshop: "Bay 2",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-8610",
    service: "AC Sanitization & Cabin HEPA Filter",
    vehicle: "2023 Toyota RAV4 Prime",
    plate: "WP CAD-1205",
    date: "2025-08-02",
    time: "03:45 PM",
    status: "Completed",
    amount: 6500,
    workshop: "Bay 1",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-8490",
    service: "Heavy-Duty Battery Test & Replacement",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2025-06-18",
    time: "01:30 PM",
    status: "Completed",
    amount: 6500,
    workshop: "Bay 3",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-8215",
    service: "Performance Exhaust Inspection",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2025-05-12",
    time: "11:00 AM",
    status: "Cancelled",
    amount: 6500,
    workshop: "Bay 3",
    technician: "Not assigned",
    progress: "Cancelled",
    notes: "Customer schedule conflict",
  },
  {
    id: "AC-8142",
    service: "Wheel Balancing & 4-Wheel Alignment",
    vehicle: "2023 Toyota RAV4 Prime",
    plate: "WP CAD-1205",
    date: "2025-04-20",
    time: "09:30 AM",
    status: "Completed",
    amount: 6500,
    workshop: "Bay 2",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-8065",
    service: "Advanced Engine Diagnostics",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2025-03-14",
    time: "10:30 AM",
    status: "Rejected",
    amount: 6500,
    workshop: "Bay 3",
    technician: "Not assigned",
    progress: "Rejected",
    notes: "Requested time slot unavailable",
  },
  {
    id: "AC-7992",
    service: "Full Synthetic Oil Change & Filter",
    vehicle: "2023 Toyota RAV4 Prime",
    plate: "WP CAD-1205",
    date: "2025-02-22",
    time: "02:00 PM",
    status: "Completed",
    amount: 6500,
    workshop: "Bay 1",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-7850",
    service: "Brake Inspection & Fluid Service",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2025-01-18",
    time: "11:00 AM",
    status: "Completed",
    amount: 6500,
    workshop: "Bay 3",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-7721",
    service: "Battery Health Inspection",
    vehicle: "2023 Toyota RAV4 Prime",
    plate: "WP CAD-1205",
    date: "2024-12-10",
    time: "10:00 AM",
    status: "Completed",
    amount: 4500,
    workshop: "Bay 1",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
  {
    id: "AC-7602",
    service: "Routine Maintenance Inspection",
    vehicle: "2021 BMW X3 M-Sport",
    plate: "WP CBG-4892",
    date: "2024-11-15",
    time: "01:00 PM",
    status: "Completed",
    amount: 4500,
    workshop: "Bay 3",
    technician: "Workshop Technician",
    progress: "Ready",
    notes: "",
  },
];

const PROGRESS_STEPS = [
  { label: "Approved", description: "Booking confirmed" },
  { label: "Check-in", description: "Vehicle arrival" },
  { label: "Servicing", description: "Work in progress" },
  { label: "Quality Test", description: "Final inspection" },
  { label: "Ready", description: "Pick-up notification" },
];

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Completed", value: "Completed" },
  { label: "Rejected", value: "Rejected" },
];

const PAGE_SIZE = 6;

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function formatCurrency(amount) {
  return `Rs.${Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "Date not set";

  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getBookingId(booking) {
  return String(
    booking?.bookingNumber ??
      booking?.bookingId ??
      booking?._id ??
      booking?.id ??
      ""
  );
}

function normalizeStatus(status = "") {
  const value = String(status).toLowerCase().trim();

  if (
    ["pending", "pending approval", "requested", "waiting"].includes(value)
  ) {
    return "Pending";
  }

  if (
    ["approved", "scheduled", "confirmed", "accepted", "check-in"].includes(
      value
    )
  ) {
    return "Approved";
  }

  if (
    ["completed", "complete", "finished", "ready", "delivered"].includes(value)
  ) {
    return "Completed";
  }

  if (["rejected", "declined"].includes(value)) {
    return "Rejected";
  }

  if (["cancelled", "canceled"].includes(value)) {
    return "Cancelled";
  }

  return status || "Pending";
}

function normalizeBooking(booking, index = 0) {
  const vehicle = booking.vehicle ?? booking.vehicleId ?? {};
  const service = booking.service ?? booking.serviceId ?? {};

  const rawDate =
    booking.appointmentDate ??
    booking.bookingDate ??
    booking.date ??
    booking.scheduledAt ??
    "";

  const date =
    rawDate && !Number.isNaN(new Date(rawDate).getTime())
      ? String(rawDate).slice(0, 10)
      : "";

  return {
    id: getBookingId(booking) || `LOCAL-${index + 1}`,
    service:
      booking.serviceName ??
      booking.serviceTitle ??
      service.name ??
      service.title ??
      (Array.isArray(booking.services)
        ? booking.services.map((item) => item.name).filter(Boolean).join(", ")
        : "") ??
      "Vehicle Service",
    vehicle:
      booking.vehicleName ??
      vehicle.model ??
      [vehicle.year, vehicle.make, vehicle.brand, vehicle.model]
        .filter(Boolean)
        .join(" ") ??
      "Vehicle",
    plate:
      booking.registrationNumber ??
      vehicle.registrationNumber ??
      vehicle.licensePlate ??
      vehicle.plateNumber ??
      "Not provided",
    date,
    time: booking.timeSlot ?? booking.appointmentTime ?? booking.time ?? "",
    status: normalizeStatus(booking.status),
    amount: Number(
      booking.totalAmount ??
        booking.estimatedTotal ??
        booking.amount ??
        booking.price ??
        service.price ??
        0
    ),
    workshop: booking.workshopName ?? booking.bay ?? "To be assigned",
    technician: booking.technicianName ?? booking.technician ?? "To be assigned",
    progress: booking.progress ?? booking.serviceProgress ?? booking.status ?? "Approved",
    notes: booking.notes ?? booking.cancellationReason ?? "",
    raw: booking,
  };
}

function getProgressIndex(progress) {
  const value = String(progress || "").toLowerCase();

  if (value.includes("ready") || value.includes("completed")) return 4;
  if (value.includes("quality")) return 3;
  if (value.includes("servic")) return 2;
  if (value.includes("check")) return 1;

  return 0;
}

function getFilterStatus(status) {
  if (status === "Pending Approval") return "Pending";
  if (status === "Approved" || status === "Scheduled") return "Approved";
  return status;
}

function getStatusClasses(status) {
  const normalized = normalizeStatus(status);

  const styles = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Approved: "border-blue-200 bg-blue-50 text-blue-700",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Rejected: "border-red-200 bg-red-50 text-red-700",
    Cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return styles[normalized] || "border-slate-200 bg-slate-50 text-slate-600";
}

function getStatusDot(status) {
  const normalized = normalizeStatus(status);

  const styles = {
    Pending: "bg-amber-500",
    Approved: "bg-blue-600",
    Completed: "bg-emerald-600",
    Rejected: "bg-red-600",
    Cancelled: "bg-red-600",
  };

  return styles[normalized] || "bg-slate-400";
}

function getBookingList(response) {
  const data = response?.data?.data ?? response?.data;

  if (Array.isArray(data)) return data;

  return (
    data?.bookings ??
    data?.results ??
    data?.items ??
    data?.data?.bookings ??
    []
  );
}

function downloadCsv(bookings) {
  const headers = [
    "Booking ID",
    "Service",
    "Vehicle",
    "Registration",
    "Date",
    "Time",
    "Status",
    "Estimated Total",
  ];

  const rows = bookings.map((booking) => [
    booking.id,
    booking.service,
    booking.vehicle,
    booking.plate,
    booking.date,
    booking.time,
    booking.status,
    booking.amount,
  ]);

  const escapeCsv = (value) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "autocare-booking-history.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------- */

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[9px] font-bold ${getStatusClasses(status)}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(status)}`} />
      {status}
    </span>
  );
}

function FilterCount({ count, color = "bg-slate-200 text-slate-700" }) {
  return (
    <span
      className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${color}`}
    >
      {count}
    </span>
  );
}

function ServiceProgress({ booking }) {
  const activeIndex = getProgressIndex(booking.progress);

  const isCancelled = ["Cancelled", "Rejected"].includes(booking.status);

  return (
    <section className="mt-5 border-t border-slate-100 pt-4">
      <h3 className="mb-4 text-[10px] font-extrabold uppercase tracking-wide text-[#555a62]">
        Service Progress Pipeline
      </h3>

      {isCancelled ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-700">
          This booking is {booking.status.toLowerCase()}.
          {booking.notes ? ` Reason: ${booking.notes}` : ""}
        </div>
      ) : (
        <div className="relative grid grid-cols-5 gap-1">
          <div className="absolute left-[10%] right-[10%] top-[14px] h-px bg-slate-200" />

          <div
            className="absolute left-[10%] top-[14px] h-px bg-[#ed5b00] transition-all"
            style={{
              width: `${Math.min((activeIndex / 4) * 80, 80)}%`,
            }}
          />

          {PROGRESS_STEPS.map((step, index) => {
            const complete = index < activeIndex;
            const active = index === activeIndex;

            return (
              <div
                key={step.label}
                className="relative z-10 flex min-w-0 flex-col items-center text-center"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                    complete
                      ? "border-[#102338] bg-[#102338] text-white"
                      : active
                        ? "border-orange-200 bg-[#ed5b00] text-white ring-4 ring-orange-50"
                        : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {complete ? <Check size={13} /> : index + 1}
                </div>

                <p
                  className={`mt-2 text-[9px] font-bold sm:text-[10px] ${
                    active || complete ? "text-[#102338]" : "text-slate-500"
                  }`}
                >
                  {index + 1}. {step.label}
                </p>

                <p className="mt-0.5 hidden text-[9px] leading-3 text-slate-400 sm:block">
                  {active
                    ? booking.time
                      ? `Scheduled ${booking.time}`
                      : step.description
                    : step.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AppointmentCard({ booking, onReschedule }) {
  return (
    <section className="mb-5 rounded-xl border border-[#cdd2dc] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#416995]">
          <Wrench size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#ed5b00]">
              Upcoming Appointment
            </span>

            <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">
              #{booking.id}
            </span>

            <StatusBadge status={booking.status} />
          </div>

          <h2 className="text-base font-extrabold leading-6 text-[#102338] sm:text-lg">
            {booking.service}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-[#555a62]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#26364b]">
              <CarFrontIcon />
              {booking.vehicle} ({booking.plate})
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-[#555a62]">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {formatDate(booking.date)} • {booking.time || "Time pending"}
            </span>

            <span className="hidden text-slate-300 sm:inline">•</span>

            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} />
              {booking.workshop} • {booking.technician}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onReschedule(booking)}
          disabled={!["Approved", "Pending"].includes(booking.status)}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-[#102338] hover:border-orange-300 hover:text-[#ed5b00] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reschedule Slot
        </button>
      </div>

      <ServiceProgress booking={booking} />
    </section>
  );
}

function CarFrontIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 17h14l1-7H4l1 7Z" />
      <path d="m7 10 2-5h6l2 5" />
      <path d="M7 17v2m10-2v2" />
      <circle cx="7.5" cy="13.5" r="1" />
      <circle cx="16.5" cy="13.5" r="1" />
    </svg>
  );
}

function BookingActions({ booking, onBookAgain, onInvoice, onReschedule }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-end gap-1.5">
      {booking.status === "Approved" && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md bg-[#102338] px-2.5 py-1.5 text-[10px] font-bold text-white"
        >
          Selected
        </button>
      )}

      {booking.status === "Pending" && (
        <button
          type="button"
          onClick={() => onReschedule(booking)}
          className="whitespace-nowrap rounded-md border border-slate-300 px-2 py-1.5 text-[10px] font-semibold text-[#102338] hover:border-orange-300"
        >
          Modify Request
        </button>
      )}

      {booking.status === "Completed" && (
        <>
          <button
            type="button"
            onClick={() => onInvoice(booking)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-[10px] font-semibold text-[#102338] hover:bg-slate-50"
          >
            Invoice
          </button>

          <button
            type="button"
            onClick={() => onBookAgain(booking)}
            className="whitespace-nowrap rounded-md bg-orange-50 px-2 py-1.5 text-[10px] font-semibold text-[#ed5b00] hover:bg-orange-100"
          >
            Book Again
          </button>
        </>
      )}

      {["Cancelled", "Rejected"].includes(booking.status) && (
        <button
          type="button"
          onClick={() => onBookAgain(booking)}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[10px] font-semibold text-[#102338] hover:border-orange-300"
        >
          Rebook
        </button>
      )}

      <button
        type="button"
        aria-label={`More actions for booking ${booking.id}`}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 min-w-40 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onInvoice(booking);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
          >
            <FileText size={14} />
            View booking details
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onBookAgain(booking);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={14} />
            Book this service again
          </button>
        </div>
      )}
    </div>
  );
}

function RescheduleModal({ booking, onClose, onSave, saving }) {
  const [date, setDate] = useState(booking.date || "");
  const [time, setTime] = useState(booking.time || "");

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="reschedule-title"
              className="text-lg font-extrabold text-[#102338]"
            >
              Reschedule Appointment
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Booking #{booking.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close reschedule dialog"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-bold text-[#102338]">{booking.service}</p>
          <p className="mt-1 text-[10px] text-slate-500">{booking.vehicle}</p>
        </div>

        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave({ booking, date, time });
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              New Appointment Date
            </span>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              Preferred Time
            </span>
            <select
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Select time</option>
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM</option>
              <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
              <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
            </select>
          </label>

          <p className="text-[10px] leading-4 text-slate-500">
            Your requested change must be approved by the workshop. The selected
            time is not a live availability confirmation.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !date || !time}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#ed5b00] text-xs font-bold text-white hover:bg-[#d65000] disabled:opacity-50"
            >
              {saving && <LoaderCircle size={14} className="animate-spin" />}
              Request Change
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function BookingDetailsModal({ booking, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#ed5b00]">
              Booking Details
            </p>
            <h2
              id="booking-details-title"
              className="mt-1 text-xl font-extrabold text-[#102338]"
            >
              #{booking.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking details"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {[
            ["Service", booking.service],
            ["Vehicle", booking.vehicle],
            ["Registration", booking.plate],
            ["Appointment Date", formatDate(booking.date)],
            ["Appointment Time", booking.time || "To be assigned"],
            ["Workshop", booking.workshop],
            ["Technician", booking.technician],
            ["Status", booking.status],
            ["Estimated Total", formatCurrency(booking.amount)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col justify-between gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:gap-4"
            >
              <span className="text-xs text-slate-500">{label}</span>
              <span className="break-words text-xs font-semibold text-[#102338] sm:max-w-[65%] sm:text-right">
                {value}
              </span>
            </div>
          ))}

          {booking.notes && (
            <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <strong>Notes: </strong>
              {booking.notes}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-10 w-full rounded-lg bg-[#102338] text-xs font-bold text-white hover:bg-[#183b58]"
        >
          Close
        </button>
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(
    SAMPLE_BOOKINGS.map(normalizeBooking)
  );

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [page, setPage] = useState(1);

  const [selectedBookingId, setSelectedBookingId] = useState("AC-8924");
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [detailsBooking, setDetailsBooking] = useState(null);
  const [savingReschedule, setSavingReschedule] = useState(false);

  const [viewMode, setViewMode] = useState("table");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  /* Load booking history from the backend. */
  useEffect(() => {
    let active = true;

    async function loadBookings() {
      setLoading(true);
      setApiError("");

      try {
        /*
         * Expected endpoint:
         * GET /api/bookings
         *
         * The current user's bookings should be returned by the backend.
         */
        const response = await api.get("/bookings");
        const results = getBookingList(response).map(normalizeBooking);

        if (!active) return;

        if (results.length > 0) {
          setBookings(results);
          setSelectedBookingId((previous) =>
            results.some((booking) => booking.id === previous)
              ? previous
              : results[0].id
          );
        } else {
          setBookings([]);
        }
      } catch (error) {
        if (!active) return;

        /*
         * Sample records are retained so the UI can be developed before
         * the booking API is available.
         */
        if (error.response) {
          setApiError(
            error.response.data?.message ||
              "Unable to load bookings from the server. Showing demonstration records."
          );
        } else {
          setApiError(
            "Booking server unavailable. Showing demonstration records."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const result = {
      All: bookings.length,
      Pending: 0,
      Approved: 0,
      Completed: 0,
      Rejected: 0,
    };

    bookings.forEach((booking) => {
      const status = getFilterStatus(booking.status);

      if (status === "Pending") result.Pending += 1;
      if (status === "Approved") result.Approved += 1;
      if (status === "Completed") result.Completed += 1;
      if (status === "Rejected") result.Rejected += 1;
    });

    return result;
  }, [bookings]);

  const vehicleOptions = useMemo(() => {
    return [...new Set(bookings.map((booking) => booking.vehicle).filter(Boolean))];
  }, [bookings]);

  const yearOptions = useMemo(() => {
    return [
      ...new Set(
        bookings
          .map((booking) => booking.date?.slice(0, 4))
          .filter(Boolean)
      ),
    ].sort((a, b) => b.localeCompare(a));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const status = getFilterStatus(booking.status);

      const matchesStatus =
        activeFilter === "All" ||
        status === activeFilter ||
        (activeFilter === "Pending" && status === "Pending");

      const matchesVehicle =
        vehicleFilter === "All Vehicles" || booking.vehicle === vehicleFilter;

      const matchesYear =
        yearFilter === "All Years" ||
        booking.date?.startsWith(yearFilter);

      const matchesSearch =
        !query ||
        [
          booking.id,
          booking.service,
          booking.vehicle,
          booking.plate,
          booking.status,
          booking.workshop,
        ].some((value) => String(value ?? "").toLowerCase().includes(query));

      return (
        matchesStatus && matchesVehicle && matchesYear && matchesSearch
      );
    });
  }, [bookings, activeFilter, vehicleFilter, yearFilter, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, vehicleFilter, yearFilter, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const pageBookings = filteredBookings.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const selectedBooking = useMemo(
    () =>
      bookings.find((booking) => booking.id === selectedBookingId) ??
      bookings.find((booking) =>
        ["Approved", "Pending"].includes(booking.status)
      ) ??
      bookings[0] ??
      null,
    [bookings, selectedBookingId]
  );

  const upcomingBooking = useMemo(() => {
    const candidates = bookings.filter((booking) =>
      ["Approved", "Pending"].includes(booking.status)
    );

    return (
      candidates.find((booking) => booking.id === selectedBookingId) ??
      candidates[0] ??
      null
    );
  }, [bookings, selectedBookingId]);

  const resetFilters = () => {
    setActiveFilter("All");
    setSearchTerm("");
    setVehicleFilter("All Vehicles");
    setYearFilter("All Years");
    setPage(1);
  };

  const handleBookAgain = (booking) => {
    navigate("/customer/book-service", {
      state: {
        previousBooking: booking.raw ?? booking,
        suggestedService: booking.service,
        vehicle: booking.vehicle,
      },
    });
  };

  const handleInvoice = (booking) => {
    setDetailsBooking(booking);
  };

  const handleReschedule = async ({ booking, date, time }) => {
    setSavingReschedule(true);
    setNotice("");
    setApiError("");

    try {
      /*
       * Expected endpoint:
       * PATCH /api/bookings/:id
       *
       * Adjust the route and field names if your Express backend differs.
       */
      await api.patch(`/bookings/${booking.id}`, {
        appointmentDate: date,
        timeSlot: time,
      });

      setBookings((previous) =>
        previous.map((item) =>
          item.id === booking.id
            ? { ...item, date, time, status: "Pending" }
            : item
        )
      );

      setRescheduleBooking(null);
      setNotice(
        `Reschedule request submitted for booking #${booking.id}.`
      );
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Unable to submit the reschedule request. Check that your backend supports PATCH /api/bookings/:id."
      );
    } finally {
      setSavingReschedule(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f4f6fa]">
      <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-[26px]">
        {/* Page heading */}
        <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#102338] sm:text-[28px]">
              My Bookings
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-[#555a62] sm:text-[13px]">
              Track upcoming service appointments, review workshop progress,
              and access past maintenance records and invoices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCsv(filteredBookings)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#cdd2dc] bg-white px-3 py-2 text-xs font-bold text-[#102338] hover:bg-slate-50 sm:px-4"
            >
              <Download size={15} />
              Export Bookings History
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer/book-service")}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#ff6817] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-[#e95a0b]"
            >
              <Plus size={16} />
              Book New Service
            </button>
          </div>
        </div>

        {/* API feedback */}
        {loading && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <LoaderCircle size={15} className="animate-spin" />
            Loading your booking history...
          </div>
        )}

        {apiError && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-xs leading-5 text-green-800"
          >
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Upcoming appointment card */}
        {upcomingBooking && (
          <AppointmentCard
            booking={upcomingBooking}
            onReschedule={setRescheduleBooking}
          />
        )}

        {/* Filters */}
        <section className="mb-5 rounded-xl border border-[#cdd2dc] bg-white p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((filter) => {
                const active = activeFilter === filter.value;

                const countColors = {
                  All: "bg-slate-600 text-white",
                  Pending: "bg-amber-100 text-amber-800",
                  Approved: "bg-blue-100 text-blue-700",
                  Completed: "bg-emerald-100 text-emerald-700",
                  Rejected: "bg-red-100 text-red-700",
                };

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`inline-flex items-center rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                      active
                        ? "bg-[#102338] text-white"
                        : "text-[#555a62] hover:bg-slate-100"
                    }`}
                  >
                    {!active && (
                      <span
                        className={`mr-2 h-2 w-2 rounded-full ${
                          filter.value === "Pending"
                            ? "bg-amber-500"
                            : filter.value === "Approved"
                              ? "bg-blue-600"
                              : filter.value === "Completed"
                                ? "bg-emerald-600"
                                : filter.value === "Rejected"
                                  ? "bg-red-600"
                                  : "bg-slate-400"
                        }`}
                      />
                    )}

                    {filter.label}

                    <FilterCount
                      count={counts[filter.value] ?? 0}
                      color={
                        active
                          ? "bg-white/20 text-white"
                          : countColors[filter.value]
                      }
                    />
                  </button>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-1 rounded-lg border border-slate-300 p-1">
              <button
                type="button"
                aria-label="Table view"
                onClick={() => setViewMode("table")}
                className={`rounded-md p-1.5 ${
                  viewMode === "table"
                    ? "bg-[#102338] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <List size={15} />
              </button>

              <button
                type="button"
                aria-label="Card view"
                onClick={() => setViewMode("cards")}
                className={`rounded-md p-1.5 ${
                  viewMode === "cards"
                    ? "bg-[#102338] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-[minmax(180px,1.5fr)_minmax(150px,1fr)_minmax(120px,0.65fr)_auto_auto]">
            <label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[#cdd2dc] px-3 focus-within:border-blue-400">
              <Search size={15} className="shrink-0 text-slate-500" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Filter by Booking ID, vehicle plate, or service..."
                className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="relative flex h-9 items-center rounded-lg border border-[#cdd2dc]">
              <select
                aria-label="Filter by vehicle"
                value={vehicleFilter}
                onChange={(event) => setVehicleFilter(event.target.value)}
                className="h-full w-full appearance-none rounded-lg bg-white px-3 pr-8 text-[11px] text-[#26364b] outline-none focus:border-blue-400"
              >
                <option>All Vehicles</option>
                {vehicleOptions.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 text-slate-500"
              />
            </label>

            <label className="relative flex h-9 items-center rounded-lg border border-[#cdd2dc]">
              <select
                aria-label="Filter by year"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="h-full w-full appearance-none rounded-lg bg-white px-3 pr-8 text-[11px] text-[#26364b] outline-none focus:border-blue-400"
              >
                <option value="All Years">All Years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    This Year ({year})
                  </option>
                ))}
              </select>

              <CalendarDays
                size={14}
                className="pointer-events-none absolute right-3 text-slate-500"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowFilterPanel((value) => !value)}
              className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[11px] font-semibold ${
                showFilterPanel
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-[#cdd2dc] text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={14} />
              Filters
            </button>

            <button
              type="button"
              onClick={resetFilters}
              aria-label="Reset all filters"
              title="Reset all filters"
              className="flex h-9 items-center justify-center rounded-lg border border-[#cdd2dc] px-3 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {showFilterPanel && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Settings2 size={15} />
                <span>
                  Showing {filteredBookings.length} matching booking
                  {filteredBookings.length === 1 ? "" : "s"}.
                </span>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#ed5b00] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Booking list */}
        <section className="overflow-hidden rounded-xl border border-[#cdd2dc] bg-white">
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#d9dde5] bg-[#f8fafc]">
                    {[
                      "Booking & Service",
                      "Vehicle",
                      "Date & Time",
                      "Status",
                      "Est. Total",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-3 py-4 text-[10px] font-extrabold uppercase tracking-wide text-[#71809b] sm:px-4"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pageBookings.map((booking) => {
                    const selected = booking.id === selectedBookingId;

                    return (
                      <tr
                        key={booking.id}
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setNotice("");
                        }}
                        className={`cursor-pointer border-b border-slate-100 transition hover:bg-blue-50/60 ${
                          selected ? "bg-[#f5f9ff]" : "bg-white"
                        }`}
                      >
                        <td className="max-w-[240px] px-3 py-4 align-top sm:px-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setDetailsBooking(booking);
                            }}
                            className="text-xs font-extrabold text-[#102338] hover:text-[#ed5b00]"
                          >
                            #{booking.id}
                          </button>

                          <p className="mt-1 max-w-[190px] text-[11px] leading-4 text-[#555a62]">
                            {booking.service}
                          </p>

                          {booking.status === "Cancelled" && booking.notes && (
                            <p className="mt-1 text-[9px] leading-3 text-red-600">
                              Reason: {booking.notes}
                            </p>
                          )}
                        </td>

                        <td className="px-3 py-4 align-middle sm:px-4">
                          <p className="text-[11px] font-bold text-[#102338]">
                            {booking.vehicle}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#71809b]">
                            {booking.plate}
                          </p>
                        </td>

                        <td className="px-3 py-4 align-middle">
                          <p className="whitespace-nowrap text-[11px] font-medium text-[#102338]">
                            {formatDate(booking.date)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#71809b]">
                            {booking.time || "Time pending"}
                          </p>
                        </td>

                        <td className="px-3 py-4 align-middle">
                          <StatusBadge status={booking.status} />
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 align-middle">
                          <span
                            className={`text-[11px] font-extrabold ${
                              ["Cancelled", "Rejected"].includes(booking.status)
                                ? "text-slate-400"
                                : "text-[#102338]"
                            }`}
                          >
                            {formatCurrency(booking.amount)}
                          </span>
                        </td>

                        <td
                          className="px-3 py-4 align-middle"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <BookingActions
                            booking={booking}
                            onBookAgain={handleBookAgain}
                            onInvoice={handleInvoice}
                            onReschedule={setRescheduleBooking}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {pageBookings.map((booking) => (
                <article
                  key={booking.id}
                  className={`rounded-xl border p-4 ${
                    booking.id === selectedBookingId
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-extrabold text-[#102338]">
                        #{booking.id}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-600">
                        {booking.service}
                      </p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-[11px]">
                    <p className="flex items-center gap-2 text-slate-600">
                      <Calendar size={14} />
                      {formatDate(booking.date)} • {booking.time}
                    </p>

                    <p className="flex items-center gap-2 text-slate-600">
                      <CarFrontIcon />
                      {booking.vehicle}
                    </p>

                    <p className="font-extrabold text-[#102338]">
                      {formatCurrency(booking.amount)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailsBooking(booking)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-700"
                    >
                      View Details
                    </button>

                    {booking.status === "Completed" && (
                      <button
                        type="button"
                        onClick={() => handleBookAgain(booking)}
                        className="rounded-md bg-orange-50 px-3 py-2 text-[10px] font-bold text-[#ed5b00]"
                      >
                        Book Again
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty state */}
          {pageBookings.length === 0 && (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <CalendarDays size={22} />
              </div>

              <h3 className="mt-3 text-sm font-extrabold text-[#102338]">
                No bookings found
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                No bookings match your current filters. Try changing your
                search or create a new service booking.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/customer/book-service")}
                  className="rounded-lg bg-[#ed5b00] px-4 py-2 text-xs font-bold text-white"
                >
                  Book a Service
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-3 border-t border-[#d9dde5] bg-[#f8fafc] px-4 py-3 sm:flex-row sm:items-center">
            <p className="text-[10px] text-[#71809b]">
              Showing{" "}
              <strong className="text-[#102338]">
                {filteredBookings.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-[#102338]">
                {Math.min(safePage * PAGE_SIZE, filteredBookings.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-[#102338]">
                {filteredBookings.length}
              </strong>{" "}
              bookings
            </p>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={13} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (number) =>
                    number === 1 ||
                    number === totalPages ||
                    Math.abs(number - safePage) <= 1
                )
                .map((number, index, visiblePages) => (
                  <span key={number} className="contents">
                    {index > 0 && visiblePages[index - 1] !== number - 1 && (
                      <span className="px-1 text-xs text-slate-400">…</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPage(number)}
                      aria-current={safePage === number ? "page" : undefined}
                      className={`h-8 min-w-8 rounded-md border px-2 text-[10px] font-bold ${
                        safePage === number
                          ? "border-[#102338] bg-[#102338] text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {number}
                    </button>
                  </span>
                ))}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Reschedule appointment modal */}
      {rescheduleBooking && (
        <RescheduleModal
          key={rescheduleBooking.id}
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onSave={handleReschedule}
          saving={savingReschedule}
        />
      )}

      {/* Booking details modal */}
      {detailsBooking && (
        <BookingDetailsModal
          booking={detailsBooking}
          onClose={() => setDetailsBooking(null)}
        />
      )}
    </div>
  );
}
