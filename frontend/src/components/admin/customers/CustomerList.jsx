
import {
  BadgeCheck,
  Truck,
  Check,
} from "lucide-react";

import { getCustomerName } from "../../../data/customerData";

const tierStyles = {
  Platinum: "border-purple-200 bg-purple-50 text-purple-700",
  Gold: "border-amber-200 bg-amber-50 text-amber-700",
  Standard: "border-slate-200 bg-slate-100 text-slate-700",
  Enterprise: "border-blue-200 bg-blue-50 text-blue-700",
  VIP: "border-purple-200 bg-purple-50 text-purple-700",
};

export default function CustomerList({
  customers,
  selectedCustomer,
  onSelect,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  page,
  pageSize,
  total,
  onPageChange,
}) {
  const allSelected =
    customers.length > 0 &&
    customers.every((customer) =>
      selectedIds.includes(customer.id)
    );

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex h-full min-h-[650px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[32px_minmax(0,2fr)_minmax(90px,1fr)_minmax(100px,1.1fr)] items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-4 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 sm:px-4">
        <label className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="h-4 w-4 accent-orange-500"
          />
        </label>

        <span>Customer & Contact</span>
        <span>Tier & Loyalty</span>
        <span>Vehicles / Fleet</span>
      </div>

      {/* CUSTOMER ROWS */}
      <div className="flex-1 divide-y divide-slate-100">
        {customers.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-400">
            No customers found.
          </div>
        ) : (
          customers.map((customer) => {
            const active =
              selectedCustomer?.id === customer.id;

            const checked = selectedIds.includes(customer.id);

            const name = getCustomerName(customer);

            const isEnterprise =
              customer.customerType === "Enterprise";

            const initials = name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={customer.id}
                onClick={() => onSelect(customer)}
                className={`grid min-h-[119px] cursor-pointer grid-cols-[32px_minmax(0,2fr)_minmax(90px,1fr)_minmax(100px,1.1fr)] items-center gap-2 border-l-2 px-3 py-4 transition sm:px-4 ${
                  active
                    ? "border-l-orange-500 bg-blue-50/50"
                    : "border-l-transparent hover:bg-slate-50"
                }`}
              >
                {/* SELECT */}
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onToggleSelect(customer.id)}
                    className="h-4 w-4 accent-orange-500"
                  />
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                      active
                        ? "border-2 border-orange-500 bg-[#10243b] text-white"
                        : isEnterprise
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isEnterprise ? (
                      <Truck size={17} />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1">
                      <p className="break-words text-xs font-bold text-[#10243b]">
                        {name}
                      </p>

                      {customer.verified && (
                        <BadgeCheck
                          size={14}
                          className="shrink-0 fill-blue-600 text-blue-600"
                        />
                      )}
                    </div>

                    {isEnterprise && (
                      <span className="my-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-[8px] font-bold text-indigo-600">
                        FLEET
                      </span>
                    )}

                    {isEnterprise && customer.contactPerson && (
                      <p className="text-[10px] text-slate-500">
                        Mgr: {customer.contactPerson} • {customer.phone}
                      </p>
                    )}

                    {!isEnterprise && (
                      <>
                        <p className="mt-1 break-all text-[10px] text-slate-500">
                          {customer.phone}
                        </p>

                        <p className="break-all text-[10px] text-slate-500">
                          {customer.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* LOYALTY */}
                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold ${
                      tierStyles[customer.tier] || tierStyles.Standard
                    }`}
                  >
                    {customer.tier === "Platinum" && "♜"}
                    {customer.tier === "Enterprise" && "Enterprise"}
                    {customer.tier !== "Enterprise" &&
                      customer.tier}
                  </span>

                  <p className="mt-1 text-[10px] text-slate-500">
                    {Number(customer.points || 0).toLocaleString()} points
                  </p>
                </div>

                {/* VEHICLES */}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#10243b]">
                    {customer.activeVehicles}{" "}
                    {customer.activeVehicles === 1 ? "Vehicle" : "Vehicles"}
                  </p>

                  <p className="mt-1 break-words text-[10px] leading-4 text-slate-500">
                    {customer.vehicles
                      ?.slice(0, 2)
                      .map((vehicle) => `${vehicle.year} ${vehicle.make} ${vehicle.model}`)
                      .join(", ") || "Fleet vehicles"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[10px] text-slate-600">
          Showing <strong>{start}</strong> to <strong>{end}</strong> of{" "}
          <strong>{total.toLocaleString()}</strong> customers
        </p>

        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from(
            { length: Math.min(totalPages, 3) },
            (_, i) => {
              const number = i + 1;

              return (
                <button
                  key={number}
                  onClick={() => onPageChange(number)}
                  className={`rounded-md border px-2.5 py-1.5 text-[10px] ${
                    page === number
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {number}
                </button>
              );
            }
          )}

          {totalPages > 3 && (
            <>
              <span className="px-1 text-xs text-slate-400">...</span>

              <button
                onClick={() => onPageChange(totalPages)}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px]"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
