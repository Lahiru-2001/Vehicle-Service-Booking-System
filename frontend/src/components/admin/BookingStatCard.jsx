
import {
  CalendarDays,
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const icons = {
  bookings: CalendarDays,
  pending: ClipboardList,
  scheduled: CalendarDays,
  service: Wrench,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const colors = {
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
};

export default function BookingStatCard({ stat }) {
  const Icon = icons[stat.icon] || Clock;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="max-w-[120px] text-[9px] font-bold leading-4 tracking-wider text-slate-500">
          {stat.title}
        </p>

        <div className={`rounded-lg p-2 ${colors[stat.color]}`}>
          <Icon size={17} />
        </div>
      </div>

      <h2 className="mt-2 text-2xl font-extrabold text-[#172c43]">
        {stat.value}
      </h2>

      <span
        className={`mt-2 inline-flex rounded-md px-2 py-1 text-[8px] font-bold ${colors[stat.color]}`}
      >
        {stat.badge}
      </span>

      <p className="mt-2 text-[9px] text-slate-400">
        {stat.subtitle}
      </p>
    </div>
  );
}
