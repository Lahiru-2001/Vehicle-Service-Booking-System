
import {
  BriefcaseBusiness,
  Banknote,
  TrendingUp,
  Timer,
} from "lucide-react";

import { formatCurrency } from "../../../data/serviceCatalogData";

export default function ServiceStats({ categories, packages }) {
  const activeCategories = categories.filter(
    (item) => item.status === "Active"
  );

  const activePackages = packages.filter(
    (item) => item.status === "Active"
  );

  const totalLabor = packages.length
    ? packages.reduce(
        (sum, item) => sum + Number(item.baseLaborCost || 0),
        0
      ) / packages.length
    : 0;

  const averageDuration = activePackages.length
    ? Math.round(
        activePackages.reduce(
          (sum, item) => sum + Number(item.duration || 0),
          0
        ) / activePackages.length
      )
    : 0;

  const mostBooked = packages[0];

  const stats = [
    {
      title: "TOTAL ACTIVE SERVICES",
      value: activePackages.length,
      suffix: "packages",
      detail: `${activeCategories.length} fully operational categories`,
      icon: BriefcaseBusiness,
      color: "blue",
    },
    {
      title: "AVG LABOR RATE",
      value: formatCurrency(totalLabor),
      suffix: "/ hr",
      detail: "Shop Standard Base",
      icon: Banknote,
      color: "orange",
    },
    {
      title: "MOST BOOKED PACKAGE",
      value: mostBooked?.name || "No packages",
      suffix: "",
      detail: "Based on available catalog data",
      icon: TrendingUp,
      color: "amber",
    },
    {
      title: "AVG SERVICE DURATION",
      value: averageDuration,
      suffix: "mins",
      detail: "Average estimated duration",
      icon: Timer,
      color: "blue",
    },
  ];

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-50 text-orange-500",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="max-w-[170px] text-[10px] font-bold tracking-wider text-slate-500">
                {stat.title}
              </p>

              <div className={`rounded-lg p-2 ${colorMap[stat.color]}`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <h2
                className={`font-extrabold text-[#10243b] ${
                  stat.title === "MOST BOOKED PACKAGE"
                    ? "text-sm leading-6"
                    : "text-2xl"
                }`}
              >
                {stat.value}
              </h2>

              <span className="text-xs text-slate-500">
                {stat.suffix}
              </span>
            </div>

            <p className="mt-3 text-[10px] leading-4 text-slate-500">
              {stat.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
