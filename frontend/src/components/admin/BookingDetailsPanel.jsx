
import { useEffect, useState } from "react";
import {
  X,
  Pencil,
  CarFront,
  UserRound,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Clock,
  XCircle,
  Mail,
  Phone,
  Gauge,
} from "lucide-react";

import {
  workshopBays,
  technicians,
} from "../../data/adminBookingsData";

export default function BookingDetailsPanel({
  booking,
  onClose,
  onApprove,
  onReject,
  onAssign,
  onReschedule,
}) {
  const [bay, setBay] = useState(booking?.bay || "");
  const [technician, setTechnician] = useState(
    booking?.technician || ""
  );

  useEffect(() => {
    setBay(booking?.bay || "");
    setTechnician(booking?.technician || "");
  }, [booking]);

  if (!booking) {
    return (
      <section className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
        <div className="text-center">
          <CarFront size={35} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm font-bold text-slate-600">
            Select a booking
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Booking details will appear here.
          </p>
        </div>
      </section>
    );
  }

  const total = booking.parts?.length
    ? booking.parts.reduce((sum, item) => sum + item.price, 0)
    : booking.amount;

  const isPending = booking.status === "PENDING APPROVAL";

  const handleAssign = () => {
    onAssign(booking.id, bay, technician);
  };

  return (
    <aside className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-200 px-3 py-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-extrabold text-[#172c43]">
              Booking Details
            </h2>

            <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${
              isPending
                ? "bg-orange-50 text-orange-600"
                : "bg-blue-50 text-blue-600"
            }`}>
              {booking.status}
            </span>
          </div>

          <p className="mt-1 text-[9px] text-slate-400">
            Reference: <strong className="text-slate-600">#{booking.id}</strong>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            title="Edit booking"
            onClick={() => onReschedule(booking)}
            className="rounded p-1 text-orange-500 hover:bg-orange-50"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={onClose}
            title="Close details"
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-260px)] space-y-3 overflow-y-auto p-3">

        {/* CUSTOMER PROFILE */}
        <PanelSection title="CUSTOMER PROFILE">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#153c5c] text-xs font-bold text-white">
              {booking.initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="text-[11px] font-extrabold text-[#172c43]">
                  {booking.customer}
                </h3>

                <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-bold text-blue-600">
                  {booking.tier}
                </span>
              </div>

              <p className="mt-1 flex items-center gap-1 text-[9px] text-slate-500">
                <Mail size={10} />
                {booking.email}
              </p>

              <p className="mt-1 flex items-center gap-1 text-[9px] text-slate-500">
                <Phone size={10} />
                {booking.phone}
              </p>
            </div>
          </div>
        </PanelSection>

        {/* VEHICLE TELEMETRY */}
        <PanelSection title="VEHICLE TELEMETRY">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#172c43]">
              {booking.vehicle}
            </h3>
            <CarFront size={15} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <InfoItem label="License Plate" value={booking.plate} />
            <InfoItem label="Current Mileage" value={booking.mileage} />
            <div className="col-span-2">
              <InfoItem label="VIN Identifier" value={booking.vin} />
            </div>
          </div>
        </PanelSection>

        {/* SERVICE SPECIFICATIONS */}
        <PanelSection title="SERVICE SPECIFICATIONS">
          <div className="flex justify-between gap-2">
            <h3 className="text-[10px] font-extrabold text-[#172c43]">
              {booking.description}
            </h3>

            <span className="whitespace-nowrap text-[9px] font-bold text-slate-600">
              Rs.{booking.amount.toLocaleString("en-US")}.00
            </span>
          </div>

          <p className="mt-2 text-[9px] leading-4 text-slate-500">
            Package: {booking.package}
          </p>

          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/60 p-2">
            <p className="flex items-center gap-1 text-[9px] font-bold text-amber-800">
              <AlertTriangle size={12} />
              Customer Symptoms / Observations:
            </p>

            <p className="mt-1 text-[9px] italic leading-4 text-amber-900">
              "{booking.symptoms}"
            </p>
          </div>
        </PanelSection>

        {/* WORKSHOP ALLOCATION */}
        <PanelSection title="WORKSHOP RESOURCE ALLOCATION">
          <label className="mb-1 block text-[9px] font-semibold text-slate-500">
            Assigned Bay
          </label>

          <select
            value={bay}
            onChange={(e) => setBay(e.target.value)}
            className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[9px] outline-none focus:border-orange-400"
          >
            {workshopBays.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-[9px] font-semibold text-slate-500">
            Master Technician
          </label>

          <select
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[9px] outline-none focus:border-orange-400"
          >
            {technicians.map((item) => (
              <option
                key={item}
                value={item.split(" (")[0]}
              >
                {item}
              </option>
            ))}
            <option value="Unassigned">Unassigned</option>
          </select>

          <button
            onClick={handleAssign}
            className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50 py-2 text-[9px] font-bold text-blue-700 hover:bg-blue-100"
          >
            Save Bay & Technician Allocation
          </button>

          <p className="mt-3 flex items-center gap-1 text-[9px] text-slate-500">
            <CalendarDays size={11} />
            Scheduled: <strong>{booking.date} ({booking.time})</strong>
          </p>
        </PanelSection>

        {/* ESTIMATED PARTS */}
        <PanelSection title="ESTIMATED PARTS & TOTAL">
          {booking.parts?.length > 0 ? (
            booking.parts.map((part, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-2 py-1.5"
              >
                <p className="text-[9px] text-slate-500">
                  {part.name}
                </p>

                <p className="whitespace-nowrap text-[9px] font-semibold text-slate-600">
                  Rs.{part.price.toLocaleString("en-US")}.00
                </p>
              </div>
            ))
          ) : (
            <p className="py-2 text-[9px] text-slate-400">
              No individual parts breakdown is available.
            </p>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3">
            <strong className="text-[10px] text-[#172c43]">
              Estimated Total Amount
            </strong>

            <strong className="text-sm text-orange-600">
              Rs.{total.toLocaleString("en-US")}.00
            </strong>
          </div>
        </PanelSection>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-3">
        {isPending && (
          <button
            onClick={() => onApprove(booking.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff711f] py-3 text-[10px] font-extrabold text-white shadow-sm hover:bg-orange-600"
          >
            <CheckCircle2 size={14} />
            Approve & Dispatch Work Order
          </button>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onReschedule(booking)}
            className="flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-1 py-2 text-[9px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            <Clock size={11} />
            Reschedule
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-1 py-2 text-[9px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            <Printer size={11} />
            Print PDF
          </button>

          <button
            onClick={() => onReject(booking.id)}
            disabled={
              booking.status === "COMPLETED" ||
              booking.status === "REJECTED" ||
              booking.status === "CANCELLED"
            }
            className="flex items-center justify-center gap-1 rounded-md border border-red-200 bg-white px-1 py-2 text-[9px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
          >
            <XCircle size={11} />
            Reject
          </button>
        </div>
      </div>
    </aside>
  );
}

function PanelSection({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-3 text-[9px] font-extrabold tracking-wide text-slate-500">
        {title}
      </h3>

      {children}
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] text-slate-400">{label}</p>
      <p className="mt-1 break-words text-[9px] font-bold text-slate-600">
        {value || "Not available"}
      </p>
    </div>
  );
}
