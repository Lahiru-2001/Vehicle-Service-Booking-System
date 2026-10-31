
import {
  CarFront,
  Droplets,
  Activity,
  Zap,
  Disc,
  Wind,
  Pencil,
  Copy,
  Archive,
  MoreHorizontal,
} from "lucide-react";

import { formatCurrency } from "../../../data/serviceCatalogData";

const iconMap = {
  "car-front": CarFront,
  oil: Droplets,
  activity: Activity,
  zap: Zap,
  disc: Disc,
  wind: Wind,
};

const colorMap = {
  red: "bg-red-50 text-red-500 border-red-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
};

export default function ServicePackagesTable({
  categories,
  packages,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onAddPackage,
  page,
  setPage,
  pageSize = 4,
}) {
  const pageCount = Math.max(
    1,
    Math.ceil(categories.length / pageSize)
  );

  const start = (page - 1) * pageSize;

  const visibleCategories = categories.slice(
    start,
    start + pageSize
  );

  const activePackageCount = packages.filter(
    (item) => item.status === "Active"
  ).length;

  const formatPriceRange = (items) => {
    if (!items.length) return "Rs.0.00";

    const prices = items.map(
      (item) =>
        Number(item.baseLaborCost || 0) +
        Number(item.partsCost || 0)
    );

    return `${formatCurrency(Math.min(...prices))} - ${formatCurrency(
      Math.max(...prices)
    )}`;
  };

  const formatDuration = (items) => {
    if (!items.length) return "N/A";

    const durations = items.map((item) =>
      Number(item.duration || 0)
    );

    return `${Math.min(...durations)} – ${Math.max(...durations)} mins`;
  };

  return (
    <section className="overflow-hidden rounded-b-xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#eff3ff]">
            <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-5">Category / Packages Included</th>
              <th className="px-3 py-5">Services</th>
              <th className="px-3 py-5">Target Bay Type</th>
              <th className="px-3 py-5">Base Price Range</th>
              <th className="px-3 py-5">Std. Duration</th>
              <th className="px-3 py-5">Status</th>
              <th className="px-4 py-5">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visibleCategories.map((category) => {
              const categoryPackages = packages.filter(
                (item) => item.category === category.id
              );

              const Icon =
                iconMap[category.icon] || CarFront;

              return (
                <tr
                  key={category.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-5">
                    <div className="flex min-w-[270px] items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                          colorMap[category.color]
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs font-extrabold text-[#10243b]">
                            {category.name}
                          </h3>

                          <span className="rounded bg-blue-100 px-2 py-1 text-[9px] text-blue-700">
                            {category.id}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1">
                          {categoryPackages.slice(0, 3).map((pkg) => (
                            <p
                              key={pkg.id}
                              className="text-[10px] leading-4 text-slate-500"
                            >
                              • {pkg.name}{" "}
                              <span className="font-medium text-slate-600">
                                {formatCurrency(pkg.baseLaborCost + pkg.partsCost)}
                              </span>
                            </p>
                          ))}

                          {categoryPackages.length > 3 && (
                            <p className="text-[9px] font-semibold text-blue-600">
                              +{categoryPackages.length - 3} more packages
                            </p>
                          )}

                          {categoryPackages.length === 0 && (
                            <p className="text-[10px] italic text-slate-400">
                              No packages added
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-5">
                    <span className="text-xs font-bold text-[#10243b]">
                      {categoryPackages.length}
                    </span>
                    <p className="text-[10px] text-slate-500">
                      packages
                    </p>
                  </td>

                  <td className="px-3 py-5">
                    <p className="max-w-[120px] text-[10px] leading-4 text-blue-700">
                      {category.bayType}
                    </p>
                  </td>

                  <td className="px-3 py-5">
                    <p className="text-[10px] font-bold text-[#10243b]">
                      {formatPriceRange(categoryPackages)}
                    </p>
                  </td>

                  <td className="px-3 py-5">
                    <p className="text-[10px] text-slate-600">
                      {formatDuration(categoryPackages)}
                    </p>
                  </td>

                  <td className="px-3 py-5">
                    <button
                      onClick={() => onToggleStatus(category.id)}
                      className={`rounded-full px-3 py-1 text-[9px] font-bold ${
                        category.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {category.status}
                    </button>
                  </td>

                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onEdit(category, categoryPackages)
                        }
                        title="Edit category"
                        className="rounded p-1.5 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => onDuplicate(category)}
                        title="Duplicate category"
                        className="rounded p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Copy size={15} />
                      </button>

                      <button
                        onClick={() => onToggleStatus(category.id)}
                        title="Activate / Deactivate"
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <Archive size={15} />
                      </button>

                      <button
                        onClick={() => onAddPackage(category)}
                        title="Add package to category"
                        className="rounded p-1.5 text-orange-600 hover:bg-orange-50"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {visibleCategories.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-16 text-center text-xs text-slate-400"
                >
                  No service categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[10px] text-slate-600">
          Showing {categories.length ? start + 1 : 0} to{" "}
          {Math.min(start + pageSize, categories.length)} of{" "}
          {categories.length} active service categories (
          {activePackageCount} packages indexed)
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-[10px] disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1).map(
            (number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`rounded border px-3 py-1.5 text-[10px] ${
                  page === number
                    ? "border-[#10243b] bg-[#10243b] text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {number}
              </button>
            )
          )}

          <button
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-[10px] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
