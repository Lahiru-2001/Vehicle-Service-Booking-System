import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CarFront,
  Check,
  CircleCheck,
  Clock3,
  MapPin,
  Wrench,
} from "lucide-react";
import { pipelineSteps } from "../../data/customerDashboardData";

function formatCurrency(amount) {
  return `Rs.${Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function UpcomingAppointment({ appointment }) {
  const navigate = useNavigate();

  const handleReschedule = () => {
    navigate("/customer/bookings", {
      state: {
        bookingId: appointment.id,
        action: "reschedule",
      },
    });
  };

  const handleDetails = () => {
    navigate("/customer/bookings", {
      state: {
        bookingId: appointment.id,
      },
    });
  };

  return (
    <section className="flex min-w-0 flex-col rounded-[14px] border border-[#d9dde5] bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,0.02)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e7ec] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-extrabold tracking-tight text-[#102338]">
            Upcoming Appointment
          </h2>

          <span className="inline-flex items-center gap-1 rounded-full border border-[#ffdf83] bg-[#fffaf0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#e86a00]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff681c]" />
            Happening Today
          </span>
        </div>

        <span className="text-[11px] font-extrabold text-[#41658f]">
          #{appointment.id}
        </span>
      </div>

      <div className="mt-4 rounded-[10px] border border-[#dbe4f5] bg-[#eef3ff] p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-lg bg-white text-[#ff681c]">
            <Wrench size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#565b63]">
                  Service Package
                </p>
                <h3 className="mt-1 text-[12px] font-extrabold leading-[1.5] text-[#152941]">
                  {appointment.packageName}
                </h3>
              </div>

              <span className="text-[11px] font-extrabold text-red-600">
                {formatCurrency(appointment.amount)}
              </span>
            </div>

            <p className="mt-1 text-[11px] leading-[1.55] text-[#515762]">
              {appointment.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#555960]">
            Assigned Vehicle
          </p>

          <p className="mt-1.5 text-[11px] font-bold text-[#142943]">
            {appointment.vehicle}
          </p>

          <span className="mt-1 inline-flex rounded bg-[#e6efff] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#253c5b]">
            {appointment.registrationNumber}
          </span>
        </div>

        <div className="sm:pl-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#555960]">
            Slot & Master Technician
          </p>

          <p className="mt-1.5 text-[11px] font-bold text-[#142943]">
            {appointment.time}
          </p>

          <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
            <Clock3 size={12} />
            {appointment.technician}
          </p>
        </div>
      </div>

      <div className="border-t border-[#e6e8ed] pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-[#555960]">
          Service Pipeline Status
        </p>

        <div className="flex items-start">
          {pipelineSteps.map((step, index) => {
            const stepNumber = index + 1;
            const completed = stepNumber < appointment.currentStep;
            const current = stepNumber === appointment.currentStep;

            return (
              <div
                key={step}
                className={`flex min-w-0 items-start ${
                  index < pipelineSteps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex shrink-0 flex-col items-center">
                  <div
                    className={`flex h-[27px] w-[27px] items-center justify-center rounded-full text-[10px] font-bold ${
                      completed
                        ? "bg-[#102338] text-white"
                        : current
                          ? "border-[3px] border-[#ffd3bf] bg-[#ff681c] text-white"
                          : "bg-[#e5eeff] text-[#43536b]"
                    }`}
                  >
                    {completed ? <Check size={15} /> : stepNumber}
                  </div>

                  <span
                    className={`mt-1.5 whitespace-nowrap text-[9px] ${
                      current
                        ? "font-bold text-[#ff681c]"
                        : completed
                          ? "font-semibold text-[#152941]"
                          : "text-[#4f535a]"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {index < pipelineSteps.length - 1 && (
                  <div
                    className={`mx-2 mt-[12px] h-[2px] min-w-[8px] flex-1 ${
                      stepNumber < appointment.currentStep
                        ? "bg-[#ff681c]"
                        : "bg-[#e5e7eb]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-[#e6e8ed] pt-3">
        <span className="inline-flex rounded-full border border-[#b8d6ff] bg-[#eaf2ff] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#426a9b]">
          {appointment.status}
        </span>

        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReschedule}
            className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-lg border border-[#cbd1dc] px-3 text-[11px] font-semibold text-[#20334a] transition hover:border-[#ff681c] hover:text-[#ff681c]"
          >
            <CalendarDays size={14} />
            Reschedule / Directions
          </button>

          <button
            type="button"
            onClick={handleDetails}
            className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-lg bg-[#0c2034] px-3 text-[11px] font-semibold text-white transition hover:bg-[#183b58]"
          >
            <CarFront size={14} />
            View Booking Details
          </button>
        </div>
      </div>
    </section>
  );
}