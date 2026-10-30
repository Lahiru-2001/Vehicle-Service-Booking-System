import {
  CalendarDays,
  Clock3,
  Wrench,
  BadgeCheck,
} from "lucide-react";

const iconMap = {
  calendar: CalendarDays,
  clock: Clock3,
  wrench: Wrench,
  shield: BadgeCheck,
};

const colorMap = {
  blue: {
    icon: "bg-[#edf3ff] text-[#294665]",
    note: "bg-[#e5efff] text-[#42648c]",
  },
  orange: {
    icon: "bg-[#fff9e8] text-[#f07800]",
    note: "border border-[#ffdf87] bg-[#fffdf5] text-[#bc6900]",
  },
  green: {
    icon: "bg-[#eafbf4] text-[#009c70]",
    note: "border border-[#a6f0d0] bg-[#f1fff9] text-[#008d65]",
  },
};

export default function StatCard({ stat }) {
  const Icon = iconMap[stat.icon] || CalendarDays;
  const colors = colorMap[stat.color] || colorMap.blue;

  return (
    <article className="min-w-0 rounded-[14px] border border-[#d9dde5] bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,0.02)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="max-w-[150px] pt-1 text-[10px] font-bold uppercase leading-[1.4] tracking-[0.035em] text-[#555960]">
          {stat.title}
        </h3>

        <div
          className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] ${colors.icon}`}
        >
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[27px] font-extrabold leading-none tracking-tight text-[#102338]">
          {stat.value}
        </p>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-semibold leading-none ${colors.note}`}
        >
          {stat.note}
        </span>
      </div>
    </article>
  );
}