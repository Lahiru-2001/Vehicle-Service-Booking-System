
import { useState } from "react";
import { workshopHours } from "../../data/adminDashboardData";

export default function WorkshopChart() {
  const [period, setPeriod] = useState("Hourly");

  const chartData =
    period === "Daily"
      ? workshopHours.slice(0, 7)
      : period === "Weekly"
        ? workshopHours.slice(0, 7)
        : workshopHours;

  const average = Math.round(
    workshopHours.reduce((sum, item) => sum + item.completed, 0) /
      workshopHours.length
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-bold text-[#172c43]">
            Peak Workshop Hours & Throughput
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Hourly vehicle intake versus completed turnover
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
          Avg Turnaround: {average} mins
        </span>
      </div>

      <div className="mt-3 flex gap-1">
        {["Hourly", "Daily", "Weekly"].map((item) => (
          <button
            key={item}
            onClick={() => setPeriod(item)}
            className={`rounded-md px-2.5 py-1 text-[9px] font-semibold transition ${
              period === item
                ? "bg-[#eaf1ff] text-[#24518b]"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex h-[155px] items-end justify-between gap-1 sm:gap-2">
          {chartData.map((item, index) => (
            <div
              key={item.time}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
            >
              {(index === 3 || index === 6) && (
                <span className="mb-1 rounded bg-orange-50 px-1 text-[7px] font-bold text-orange-600">
                  Peak
                </span>
              )}

              <div className="flex h-[125px] w-full items-end justify-center gap-1">
                <div
                  className={`w-[35%] max-w-[13px] rounded-t-sm ${
                    index === 3 || index === 6
                      ? "bg-orange-200"
                      : "bg-slate-200"
                  }`}
                  style={{
                    height: `${item.scheduled}%`,
                  }}
                  title={`Scheduled: ${item.scheduled}`}
                />

                <div
                  className={`w-[35%] max-w-[13px] rounded-t-sm ${
                    index === 3 || index === 6
                      ? "bg-orange-500"
                      : "bg-[#19466c]"
                  }`}
                  style={{
                    height: `${item.completed}%`,
                  }}
                  title={`Completed: ${item.completed}`}
                />
              </div>

              <span className="mt-2 text-[8px] font-medium text-slate-500">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 text-[9px] text-slate-500">
          <span className="h-2 w-2 rounded-sm bg-slate-200" />
          Scheduled Slots
        </span>

        <span className="flex items-center gap-1.5 text-[9px] text-slate-500">
          <span className="h-2 w-2 rounded-sm bg-[#19466c]" />
          Completed / Active
        </span>

        <span className="flex items-center gap-1.5 text-[9px] text-slate-500">
          <span className="h-2 w-2 rounded-sm bg-orange-500" />
          Surge Capacity Peak
        </span>
      </div>
    </section>
  );
}
