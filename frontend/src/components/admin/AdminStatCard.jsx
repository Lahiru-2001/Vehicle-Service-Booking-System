
import {
  CarFront,
  ClipboardList,
  Activity,
  Wallet,
  TrendingUp,
} from "lucide-react";

const icons = {
  CarFront,
  ClipboardList,
  Activity,
  Wallet,
};

const styles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    border: "border-slate-200",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    border: "border-orange-200",
  },
  green: {
    icon: "bg-green-50 text-green-600",
    border: "border-slate-200",
  },
};

export default function AdminStatCard({ stat }) {
  const Icon = icons[stat.icon] || Activity;
  const style = styles[stat.color] || styles.blue;

  return (
    <div
      className={`rounded-xl border ${style.border} bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold tracking-wider text-slate-500">
          {stat.title}
        </p>

        <div className={`rounded-lg p-2 ${style.icon}`}>
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h2 className="text-[25px] font-extrabold tracking-tight text-[#142b43]">
          {stat.value}
        </h2>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-bold ${
            stat.color === "orange"
              ? "bg-orange-50 text-orange-600"
              : stat.color === "green"
                ? "bg-green-50 text-green-600"
                : "bg-green-50 text-green-600"
          }`}
        >
          {stat.change}
        </span>
      </div>

      {stat.title === "DAILY REVENUE TARGET" ? (
        <>
          <p className="mt-1 text-[10px] text-slate-500">
            {stat.subtitle} / Rs.150,000
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: "83.3%" }}
            />
          </div>
        </>
      ) : (
        <p className="mt-2 text-[10px] leading-4 text-slate-500">
          {stat.subtitle}
        </p>
      )}
    </div>
  );
}
