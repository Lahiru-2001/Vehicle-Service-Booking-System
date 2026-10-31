
import { serviceBreakdown } from "../../data/adminDashboardData";
import { ArrowUpRight } from "lucide-react";

export default function ServiceBreakdown() {
  let accumulated = 0;

  const gradient = serviceBreakdown
    .map((service) => {
      const start = accumulated;
      accumulated += service.percentage;

      return `${service.color} ${start}% ${accumulated}%`;
    })
    .join(", ");

  const totalRevenue = 38420;

  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-bold text-[#172c43]">
            Service Breakdown
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Monthly revenue volume distribution
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-2 py-1 text-[9px] font-bold text-green-600">
          +18.4% MoM
        </span>
      </div>

      <div className="my-7 flex flex-wrap items-center justify-center gap-5">
        {/* DOUGHNUT CHART */}
        <div
          className="relative flex h-[135px] w-[135px] shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="flex h-[91px] w-[91px] flex-col items-center justify-center rounded-full bg-white">
            <span className="text-[9px] text-slate-500">
              Total GMV
            </span>

            <strong className="text-[13px] font-extrabold text-[#172c43]">
              Rs.{totalRevenue.toLocaleString("en-US")}
            </strong>
          </div>
        </div>

        {/* LEGEND */}
        <div className="min-w-[125px] flex-1 space-y-3">
          {serviceBreakdown.map((service) => (
            <div
              key={service.name}
              className="flex items-center gap-2"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: service.color }}
              />

              <span className="min-w-0 flex-1 text-[9px] font-medium text-slate-600">
                {service.name}
              </span>

              <span className="text-[9px] font-bold text-[#172c43]">
                {service.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <p className="text-[9px] text-slate-500">
          Busiest Category:{" "}
          <strong className="text-[#172c43]">
            Brake Services
          </strong>
        </p>

        <button className="flex items-center gap-1 text-[9px] font-bold text-orange-600 hover:text-orange-700">
          View Detailed Ledger
          <ArrowUpRight size={12} />
        </button>
      </div>
    </section>
  );
}
