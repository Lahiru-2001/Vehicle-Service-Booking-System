
import {
  Users,
  Truck,
  CarFront,
  Trophy,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { formatMoney } from "../../../data/customerData";

export default function CustomerStats({ customers }) {
  const totalVehicles = customers.reduce(
    (sum, customer) => sum + Number(customer.activeVehicles || 0),
    0
  );

  const enterpriseCount = customers.filter(
    (customer) => customer.tier === "Enterprise"
  ).length;

  const vipCount = customers.filter(
    (customer) => ["Platinum", "VIP"].includes(customer.tier)
  ).length;

  const averageLTV = customers.length
    ? customers.reduce(
        (sum, customer) => sum + Number(customer.lifetimeSpend || 0),
        0
      ) / customers.length
    : 0;

  const stats = [
    {
      title: "Total Registered",
      value: "1,248",
      icon: Users,
      color: "blue",
      description: "Customer accounts",
      trend: "12% this month",
    },
    {
      title: "Fleet & Enterprise",
      value: "42",
      icon: Truck,
      color: "indigo",
      description: "Active commercial accounts",
    },
    {
      title: "Vehicles in System",
      value: "2,890",
      icon: CarFront,
      color: "amber",
      description: "Tracked OBD-II Telemetry",
    },
    {
      title: "VIP / Platinum Tier",
      value: "315",
      icon: Trophy,
      color: "purple",
      description: "Top Tier Loyalty Program",
    },
    {
      title: "Average Customer LTV",
      value: formatMoney(averageLTV || 60000),
      icon: Wallet,
      color: "green",
      description: "Avg 4.8 visits / year",
    },
  ];

  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold leading-5 text-slate-500">
                {stat.title}
              </p>

              <div className={`rounded-lg p-2 ${colors[stat.color]}`}>
                <Icon size={17} />
              </div>
            </div>

            <h2 className="mt-4 truncate text-2xl font-extrabold tracking-tight text-[#10243b]">
              {stat.value}
            </h2>

            {stat.trend ? (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <TrendingUp size={12} />
                {stat.trend}
              </p>
            ) : (
              <p className="mt-1 text-[10px] text-slate-500">
                {stat.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
