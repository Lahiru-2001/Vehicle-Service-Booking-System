
import {
  Search,
  CalendarDays,
  Download,
  CheckCheck,
  ChevronDown,
  Columns3,
} from "lucide-react";

export default function BookingFilters({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  tabs,
  counts,
  service,
  setService,
  bay,
  setBay,
  technician,
  setTechnician,
  dateRange,
  setDateRange,
  onBatchApprove,
  onExport,
  selectedCount,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {/* SEARCH */}
      <div className="mb-3 flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings (#AC, Customer, Plate)..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Download size={14} />
          Export Report
        </button>
      </div>

      {/* STATUS TABS */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold transition ${
              activeTab === tab
                ? "bg-[#102b43] text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab}

            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {counts[tab] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* FILTERS */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          value={service}
          onChange={setService}
          options={[
            "All Services",
            "Brake Service",
            "Lube & Filter",
            "Wheel Alignment",
            "Diagnostics",
            "EV Inspection",
            "AC Service",
          ]}
        />

        <FilterSelect
          value={bay}
          onChange={setBay}
          options={[
            "All Bays",
            "Bay 1 (Heavy Lift)",
            "Bay 2 (Alignment)",
            "Bay 3",
            "Bay 4 (Diagnostics)",
            "Bay 5 (EV)",
            "Bay 6",
            "Unassigned Bay",
          ]}
        />

        <FilterSelect
          value={technician}
          onChange={setTechnician}
          options={[
            "All Technicians",
            "David Miller",
            "Sarah Jenkins",
            "Carlos Mendez",
            "Alex Chen",
            "Unassigned",
          ]}
        />

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2">
          <CalendarDays size={14} className="text-slate-400" />

          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="min-w-0 w-full bg-transparent py-2 text-[10px] outline-none"
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onBatchApprove}
          disabled={selectedCount === 0}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCheck size={13} />
          Batch Approve ({selectedCount})
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Download size={13} />
          Export CSV
        </button>

        <button
          type="button"
          title="Table columns"
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
        >
          <Columns3 size={14} />
        </button>
      </div>
    </section>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-[10px] text-slate-600 outline-none focus:border-orange-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
