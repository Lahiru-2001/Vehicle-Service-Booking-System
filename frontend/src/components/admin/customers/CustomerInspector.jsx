
import {
  X,
  Pencil,
  BadgeCheck,
  Phone,
  Mail,
  MapPin,
  CarFront,
  CalendarPlus,
  MessageSquare,
  ClipboardList,
  Clock,
  Gauge,
  ShieldCheck,
  ChevronRight,
  Wallet,
} from "lucide-react";

import {
  formatMoney,
  getCustomerName,
} from "../../../data/customerData";

export default function CustomerInspector({
  customer,
  onClose,
  onEdit,
  onAddVehicle,
  onCreateBooking,
  onSendReminder,
  onViewDossier,
}) {
  if (!customer) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center">
        <div>
          <CarFront
            size={35}
            className="mx-auto text-slate-300"
          />
          <p className="mt-3 text-sm font-bold text-slate-600">
            Select a customer
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Customer details will appear here.
          </p>
        </div>
      </div>
    );
  }

  const name = getCustomerName(customer);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const tierColor = {
    Platinum: "bg-purple-100 text-purple-700",
    Gold: "bg-amber-100 text-amber-700",
    Standard: "bg-slate-100 text-slate-700",
    Enterprise: "bg-blue-100 text-blue-700",
    VIP: "bg-purple-100 text-purple-700",
  };

  const accountStats = [
    {
      title: "Active Vehicles",
      value: `${customer.activeVehicles || 0} Registered`,
      icon: CarFront,
      color: "text-slate-700",
    },
    {
      title: "Total Visits",
      value: `${customer.totalVisits || 0} Completed`,
      icon: ClipboardList,
      color: "text-slate-700",
    },
    {
      title: "Lifetime Spend",
      value: formatMoney(customer.lifetimeSpend),
      icon: Wallet,
      color: "text-emerald-600",
    },
    {
      title: "Overdue Invoices",
      value: `${formatMoney(customer.overdueInvoices)}`,
      icon: Clock,
      color: "text-slate-800",
    },
  ];

  return (
    <div className="flex h-full min-h-[650px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* INSPECTOR HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/50 px-4 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Customer Inspector
          </p>

          <h3 className="mt-1 text-sm font-extrabold text-[#10243b]">
            Ref #{customer.id}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(customer)}
            title="Edit Customer"
            className="rounded p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={onClose}
            title="Close inspector"
            className="rounded p-1.5 text-slate-400 hover:bg-slate-200"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* INSPECTOR CONTENT */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">

        {/* CUSTOMER PROFILE */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-orange-500 bg-[#10243b] text-sm font-extrabold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1">
                <h3 className="break-words text-sm font-extrabold text-[#10243b]">
                  {name}
                </h3>

                {customer.verified && (
                  <BadgeCheck
                    size={16}
                    className="fill-blue-600 text-blue-600"
                  />
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-[9px] font-extrabold ${
                    tierColor[customer.tier] || tierColor.Standard
                  }`}
                >
                  {customer.tier.toUpperCase()} CLUB
                </span>

                <span className="text-[10px] text-slate-500">
                  Member {customer.memberSince || "New Member"}
                </span>
              </div>

              {customer.customerType === "Enterprise" && (
                <p className="mt-1 text-[10px] font-semibold text-blue-700">
                  Commercial / Fleet Account
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <p className="flex items-center gap-2 break-all text-[11px] text-slate-600">
              <Phone size={12} className="shrink-0 text-slate-400" />
              {customer.phone || "Not provided"}
            </p>

            <p className="flex items-center gap-2 break-all text-[11px] text-slate-600">
              <Mail size={12} className="shrink-0 text-slate-400" />
              {customer.email || "Not provided"}
            </p>

            <p className="flex items-start gap-2 text-[11px] text-slate-600">
              <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
              {customer.location || "Location not provided"}
            </p>
          </div>
        </div>

        {/* CUSTOMER STATISTICS */}
        <div className="grid grid-cols-2 gap-2">
          {accountStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="min-w-0 rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[10px] text-slate-500">
                    {stat.title}
                  </p>

                  <Icon size={13} className="text-slate-400" />
                </div>

                <p
                  className={`mt-2 break-words text-sm font-extrabold ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* REGISTERED VEHICLES */}
        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
              Registered Vehicles
            </h4>

            <button
              onClick={() => onAddVehicle(customer)}
              className="text-[10px] font-bold text-orange-600 hover:text-orange-700"
            >
              + Add Vehicle
            </button>
          </div>

          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {customer.vehicles?.length ? (
              customer.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <CarFront
                        size={17}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <div className="min-w-0">
                        <p className="break-words text-xs font-extrabold text-[#10243b]">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>

                        <p className="mt-1 break-all text-[9px] text-slate-500">
                          VIN: {vehicle.vin || "N/A"} • WP{" "}
                          {vehicle.plate || "N/A"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                        vehicle.status === "Healthy"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {vehicle.status || "Unknown"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Gauge size={12} />
                      Mileage: <strong>{vehicle.mileage || "N/A"}</strong>
                    </span>

                    <span className="text-right font-semibold text-orange-600">
                      {vehicle.nextService || "Service not scheduled"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-xs text-slate-400">
                No vehicles registered.
              </p>
            )}
          </div>
        </section>

        {/* CUSTOMER ACTIONS */}
        <section className="space-y-2">
          <button
            onClick={() => onCreateBooking(customer)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff6b1a] px-3 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-orange-600"
          >
            <CalendarPlus size={16} />
            Create Service Booking for Customer
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSendReminder(customer)}
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              <MessageSquare size={13} />
              Send SMS Reminder
            </button>

            <button
              onClick={() => onViewDossier(customer)}
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ClipboardList size={13} />
              View Full Dossier
            </button>
          </div>
        </section>

        {/* RECENT SERVICE HISTORY */}
        <section>
          <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-600">
            Recent Service History
          </h4>

          <div className="space-y-2">
            {customer.recentServices?.length ? (
              customer.recentServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-bold text-[#10243b]">
                      {service.name}
                    </p>

                    <span className="shrink-0 text-[10px] font-bold text-slate-700">
                      {formatMoney(service.price)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500">
                    <span>
                      {service.date} • {service.status}
                    </span>

                    <span>
                      {service.bay} (Tech: {service.technician})
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center">
                <p className="text-[10px] text-slate-400">
                  No recent service records available.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
