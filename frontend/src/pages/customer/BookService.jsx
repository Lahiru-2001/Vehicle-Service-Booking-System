import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Clock,
  ClipboardList,
  Fan,
  Gauge,
  Info,
  Laptop,
  ListFilter,
  LoaderCircle,
  MapPin,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import api from "../../api/client";

const SAMPLE_VEHICLES = [
  {
    _id: "vehicle-1",
    id: "vehicle-1",
    make: "BMW",
    model: "2021 BMW X3 M-Sport",
    registrationNumber: "WP CBG-4892",
    vin: "WBAX39201L04821",
    odometer: 42350,
    health: "Normal",
  },
  {
    _id: "vehicle-2",
    id: "vehicle-2",
    make: "Toyota",
    model: "2023 Toyota RAV4 Prime",
    registrationNumber: "WP CAD-1205",
    vin: "JTMRWRFV0PD123456",
    odometer: 28500,
    health: "Normal",
  },
];

const SAMPLE_SERVICES = [
  {
    id: "oil",
    name: "Full Synthetic Oil Change & Filter",
    category: "Routine Maintenance",
    description:
      "Includes OEM Castrol/Mobil 1 oil, premium filter, multi-point digital inspection and essential fluid top-offs.",
    price: 6500,
    duration: 45,
    badge: "RECOMMENDED",
    icon: "wrench",
  },
  {
    id: "brakes",
    name: "Comprehensive Brake Service & Fluid Flush",
    category: "Brakes & Tires",
    description:
      "Ceramic pad thickness scan, rotor resurfacing check, caliper slide pin lubrication, and brake line fluid pressure flush.",
    price: 6500,
    duration: 60,
    badge: "DUE AT 45K",
    icon: "brakes",
  },
  {
    id: "diagnostics",
    name: "Advanced Engine Diagnostics (OBD-II)",
    category: "Diagnostics",
    description:
      "Full computerized ECU telemetry scan, fault memory evaluation, live-data logging, and sensor calibration.",
    price: 6500,
    duration: 90,
    icon: "laptop",
  },
  {
    id: "ac",
    name: "Complete AC Sanitization & Cabin Filter",
    category: "Routine Maintenance",
    description:
      "Evaporator coil antibacterial foam treatment, HEPA activated-charcoal cabin air filter replacement and vent refresh.",
    price: 6500,
    duration: 50,
    icon: "fan",
  },
  {
    id: "alignment",
    name: "Wheel Balancing & 4-Wheel Alignment",
    category: "Brakes & Tires",
    description:
      "Computerized 3D laser caster/camber calibration, high-speed dynamic wheel rebalancing and tire rotation.",
    price: 6500,
    duration: 40,
    icon: "gauge",
  },
  {
    id: "battery",
    name: "Heavy-Duty Battery Test & Replacement",
    category: "Diagnostics",
    description:
      "Terminal descaling, cold-cranking amp conductance test, alternator regulator audit and optional AGM swap.",
    price: 6500,
    duration: 30,
    icon: "battery",
  },
];

const CATEGORIES = [
  "All Packages",
  "Routine Maintenance",
  "Brakes & Tires",
  "Diagnostics",
];

const SAMPLE_USER = {
  fullName: "Kasun Rathnayake",
  email: "customer@gmail.com",
};

const formatCurrency = (value) =>
  `Rs.${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function unwrapList(response) {
  const data = response?.data?.data ?? response?.data;

  if (Array.isArray(data)) return data;

  return (
    data?.vehicles ??
    data?.services ??
    data?.packages ??
    data?.results ??
    data?.items ??
    []
  );
}

function getId(item) {
  return String(item?._id ?? item?.id ?? "");
}

function normalizeVehicle(vehicle) {
  return {
    ...vehicle,
    id: getId(vehicle),
    make: vehicle.make ?? vehicle.brand ?? "Vehicle",
    model:
      vehicle.model ??
      [vehicle.year, vehicle.make, vehicle.brand].filter(Boolean).join(" ") ??
      "My Vehicle",
    registrationNumber:
      vehicle.registrationNumber ??
      vehicle.licensePlate ??
      vehicle.plateNumber ??
      "Registration not provided",
    vin: vehicle.vin ?? vehicle.VIN ?? "Not provided",
    odometer: vehicle.odometer ?? vehicle.mileage ?? 0,
    health: vehicle.health ?? "Normal",
  };
}

function normalizeService(service, index) {
  return {
    ...service,
    id: getId(service) || service.code || `service-${index}`,
    name: service.name ?? service.title ?? service.packageName ?? "Vehicle Service",
    category:
      service.category?.name ??
      service.categoryName ??
      service.category ??
      "Routine Maintenance",
    description: service.description ?? "Professional vehicle maintenance service.",
    price: Number(service.price ?? service.amount ?? service.cost ?? 0),
    duration: Number(service.duration ?? service.durationMinutes ?? 45),
    badge: service.badge ?? "",
    icon: service.icon ?? "wrench",
  };
}

function ServiceIcon({ type = "wrench", size = 19 }) {
  const icons = {
    wrench: Wrench,
    brakes: Wrench,
    laptop: Laptop,
    fan: Fan,
    gauge: Gauge,
    battery: SlidersHorizontal,
  };

  const Icon = icons[type] || Wrench;

  return <Icon size={size} />;
}

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, title: "Vehicle Selection", subtitle: "Choose your vehicle" },
    { number: 2, title: "Choose Service", subtitle: "Select packages" },
    { number: 3, title: "Date & Time Slot", subtitle: "Choose appointment" },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-[#cdd2dc] bg-white p-4 sm:grid-cols-3 sm:gap-3 sm:p-5">
      {steps.map((step, index) => {
        const completed = currentStep > step.number;
        const active = currentStep === step.number;

        return (
          <div key={step.number} className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                completed
                  ? "bg-[#102338] text-white"
                  : active
                    ? "border-4 border-orange-100 bg-[#ed5b00] text-white"
                    : "border border-slate-300 bg-[#eaf0ff] text-slate-500"
              }`}
            >
              {completed ? <Check size={18} /> : step.number}
            </div>

            <div className="min-w-0">
              <p
                className={`text-[10px] font-bold uppercase tracking-wide ${
                  active ? "text-[#ed5b00]" : "text-slate-500"
                }`}
              >
                STEP {step.number}
                {active ? " • ACTIVE" : ""}
              </p>

              <p className="text-xs font-extrabold text-[#102338]">
                {step.title}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                {step.number === 1 && currentStep > 1
                  ? "Vehicle selected"
                  : step.number === 2 && currentStep > 2
                    ? "Services selected"
                    : step.subtitle}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="ml-auto hidden h-px flex-1 bg-slate-300 sm:block" />
            )}
          </div>
        );
      })}
    </section>
  );
}

function VehicleCard({ vehicle, onChangeVehicle, onAddVehicle }) {
  return (
    <section className="mb-5 rounded-xl border border-[#cdd2dc] bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#cdd2dc] bg-[#eef3ff] text-[#102338]">
          <CarFront size={25} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-extrabold text-[#102338]">
              {vehicle.model}
            </h2>

            <span className="rounded-full border border-[#cbd8ef] bg-[#edf3ff] px-2 py-0.5 text-[9px] font-semibold text-[#416995]">
              {vehicle.registrationNumber}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#555a62]">
            <span>VIN: {vehicle.vin}</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Odometer: {Number(vehicle.odometer).toLocaleString()} km
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Health Check: {vehicle.health}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onChangeVehicle}
            className="rounded-lg border border-[#cbd1dc] px-3 py-1.5 text-[10px] font-medium text-[#26364b] hover:border-orange-400"
          >
            Change Vehicle
          </button>

          <button
            type="button"
            onClick={onAddVehicle}
            className="inline-flex items-center gap-1 rounded-lg bg-[#eaf1ff] px-3 py-1.5 text-[10px] font-semibold text-[#416995] hover:bg-blue-100"
          >
            <Plus size={13} />
            Add New
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, selected, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`flex min-h-[205px] w-full flex-col rounded-xl border-2 p-4 text-left transition ${
        selected
          ? "border-[#ed5b00] bg-[#fffdfb] shadow-sm"
          : "border-[#d9dde5] bg-white hover:border-orange-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            selected
              ? "bg-[#ffded0] text-[#ed5b00]"
              : "bg-[#eef3ff] text-[#416995]"
          }`}
        >
          <ServiceIcon type={service.icon} />
        </span>

        {selected ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#ed5b00] text-white">
            <Check size={14} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-[#ffd0ba] px-2 py-1 text-[10px] font-medium text-[#ed5b00]">
            <Plus size={12} />
            Add
          </span>
        )}
      </div>

      {service.badge && (
        <span
          className={`mt-3 w-fit rounded-full px-2 py-1 text-[9px] font-bold ${
            service.badge.toLowerCase().includes("due")
              ? "bg-red-100 text-red-600"
              : "bg-[#e6efff] text-[#416995]"
          }`}
        >
          {service.badge}
        </span>
      )}

      <h3 className="mt-3 text-[13px] font-extrabold leading-5 text-[#102338]">
        {service.name}
      </h3>

      <p className="mt-1.5 flex-1 text-[11px] leading-[1.55] text-[#555a62]">
        {service.description}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e2e5eb] pt-3">
        <span className="inline-flex items-center gap-1 text-[10px] text-[#555a62]">
          <Clock size={13} />
          Est. {service.duration} mins
        </span>

        <span className="whitespace-nowrap text-[11px] font-extrabold text-[#102338]">
          {formatCurrency(service.price)}
        </span>
      </div>
    </button>
  );
}

function BookingSummary({
  vehicle,
  selectedServices,
  date,
  time,
  onEditSlot,
  onConfirm,
  submitting,
  onRemoveService,
}) {
  const subtotal = selectedServices.reduce(
    (total, service) => total + service.price,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <aside className="self-start rounded-xl border border-[#cdd2dc] bg-white p-4">
      <div className="flex items-start justify-between gap-3 border-b border-[#e0e4eb] pb-4">
        <div>
          <h2 className="text-sm font-extrabold text-[#102338]">
            Booking Summary
          </h2>
          <p className="mt-1 text-[10px] text-[#555a62]">
            AutoCare Certified Workshop Bay
          </p>
        </div>

        <span className="rounded-full bg-[#b4d5ff] px-2.5 py-1 text-[9px] font-semibold text-[#345a80]">
          {selectedServices.length}{" "}
          {selectedServices.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-[#cdd5e2] bg-[#eff4ff] p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#102338] text-white">
            <CarFront size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-extrabold text-[#102338]">
              {vehicle.model}
            </p>
            <p className="mt-0.5 text-[10px] text-[#555a62]">
              Plate: {vehicle.registrationNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-[#cdd2dc] p-3">
        <div className="flex items-start gap-2">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#ed5b00]" />

          <div className="min-w-0 flex-1">
            {date && time ? (
              <>
                <p className="text-[11px] font-bold text-[#102338]">{date}</p>
                <p className="mt-1 text-[10px] text-[#555a62]">{time}</p>
              </>
            ) : (
              <p className="text-[11px] text-slate-500">
                No appointment slot selected
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onEditSlot}
            className="text-[10px] font-semibold text-[#ed5b00] hover:underline"
          >
            {date && time ? "Edit Slot" : "Select"}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {selectedServices.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-3 text-center text-[11px] text-slate-500">
            Select a service package to see your estimated cost.
          </p>
        ) : (
          selectedServices.map((service) => (
            <div
              key={service.id}
              className="flex items-start justify-between gap-2"
            >
              <div className="flex min-w-0 items-start gap-1.5">
                <button
                  type="button"
                  aria-label={`Remove ${service.name}`}
                  onClick={() => onRemoveService(service.id)}
                  className="mt-0.5 text-slate-400 hover:text-red-600"
                >
                  <X size={12} />
                </button>

                <span className="text-[10px] leading-4 text-[#26364b]">
                  {service.name}
                </span>
              </div>

              <span className="shrink-0 text-[10px] font-semibold text-[#102338]">
                {formatCurrency(service.price)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 space-y-3 border-t border-[#e0e4eb] pt-4 text-[10px]">
        <div className="flex justify-between gap-3 text-[#555a62]">
          <span>Workshop Environmental Fee</span>
          <span>{formatCurrency(0)}</span>
        </div>

        <div className="flex justify-between gap-3 text-[#555a62]">
          <span>Applicable Tax (GST/HST 8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between gap-3 border-t border-[#e0e4eb] pt-3 text-[#555a62]">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-1">
          <span className="text-base font-extrabold text-[#102338]">
            Estimated Total
          </span>
          <span className="text-lg font-extrabold text-[#ed5b00]">
            {formatCurrency(total)}
          </span>
        </div>

        <p className="text-[9px] text-[#555a62]">
          Final charges may change after workshop inspection.
        </p>
      </div>

      <div className="mt-4 space-y-2 rounded-lg border border-[#cdd2dc] bg-[#f8faff] p-3">
        <div className="flex items-start gap-2 text-[10px] text-[#26364b]">
          <ShieldCheck size={14} className="shrink-0 text-green-600" />
          <span>12-Month / 20,000 km warranty, where applicable.</span>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-[#26364b]">
          <BadgeCheck size={14} className="shrink-0 text-green-600" />
          <span>Genuine OEM certified parts guarantee.</span>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-[#26364b]">
          <ClipboardList size={14} className="shrink-0 text-green-600" />
          <span>Complimentary multi-point digital inspection.</span>
        </div>
      </div>

      <button
        type="button"
        disabled={submitting || selectedServices.length === 0}
        onClick={onConfirm}
        className="mt-5 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#ed5b00] px-4 py-2 text-[11px] font-extrabold text-white shadow-sm transition hover:bg-[#d65000] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Confirm & Proceed to Booking
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="mt-2 text-center text-[9px] leading-4 text-[#555a62]">
        No payment required now. Payment can be completed according to workshop
        policy.
      </p>
    </aside>
  );
}

function SlotModal({ date, time, onDateChange, onTimeChange, onClose, onSave }) {
  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="slot-dialog-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ed5b00]">
              <Calendar size={20} />
            </div>

            <h2
              id="slot-dialog-title"
              className="text-lg font-extrabold text-[#102338]"
            >
              Choose Date & Time
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select your preferred workshop appointment.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close date selection"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">
              Appointment Date
            </span>

            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">
              Available Time Preference
            </span>

            <select
              value={time}
              onChange={(event) => onTimeChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Choose a time</option>
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM</option>
              <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
              <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
            </select>
          </label>

          <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-[11px] leading-5 text-blue-800">
            <Info size={15} className="mt-0.5 shrink-0" />
            Time choices are preferences, not confirmed live workshop
            availability. Your booking must be checked by the backend.
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={!date || !time}
            className="h-10 flex-1 rounded-lg bg-[#ed5b00] text-xs font-bold text-white hover:bg-[#d65000] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Appointment
          </button>
        </div>
      </section>
    </div>
  );
}

export default function BookService() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState(SAMPLE_VEHICLES);
  const [services, setServices] = useState(SAMPLE_SERVICES);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    SAMPLE_VEHICLES[0].id
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState(["oil", "brakes"]);
  const [category, setCategory] = useState("All Packages");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentStep, setCurrentStep] = useState(2);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    registrationNumber: "",
    vin: "",
    odometer: "",
  });

  useEffect(() => {
    let active = true;

    async function loadBookingData() {
      setLoading(true);
      setErrorMessage("");

      const [vehicleResult, serviceResult] = await Promise.allSettled([
        api.get("/vehicles"),
        api.get("/services"),
      ]);

      if (!active) return;

      if (vehicleResult.status === "fulfilled") {
        const loadedVehicles = unwrapList(vehicleResult.value)
          .map(normalizeVehicle)
          .filter((vehicle) => vehicle.id);

        if (loadedVehicles.length > 0) {
          setVehicles(loadedVehicles);
          setSelectedVehicleId((previous) =>
            loadedVehicles.some((vehicle) => vehicle.id === previous)
              ? previous
              : loadedVehicles[0].id
          );
        }
      }

      if (serviceResult.status === "fulfilled") {
        const loadedServices = unwrapList(serviceResult.value)
          .map(normalizeService)
          .filter((service) => service.id);

        if (loadedServices.length > 0) {
          setServices(loadedServices);
          setSelectedServiceIds((previous) =>
            previous.filter((id) =>
              loadedServices.some((service) => service.id === id)
            )
          );
        }
      }

      // Sample data remains usable if the API endpoints are not implemented.
      setLoading(false);
    }

    loadBookingData();

    return () => {
      active = false;
    };
  }, []);

  const selectedVehicle = useMemo(
    () =>
      vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ??
      vehicles[0] ??
      SAMPLE_VEHICLES[0],
    [vehicles, selectedVehicleId]
  );

  const filteredServices = useMemo(
    () =>
      services.filter(
        (service) =>
          category === "All Packages" || service.category === category
      ),
    [services, category]
  );

  const selectedServices = useMemo(
    () => services.filter((service) => selectedServiceIds.includes(service.id)),
    [services, selectedServiceIds]
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.duration,
    0
  );

  const toggleService = (serviceId) => {
    setSelectedServiceIds((previous) =>
      previous.includes(serviceId)
        ? previous.filter((id) => id !== serviceId)
        : [...previous, serviceId]
    );

    setErrorMessage("");
    setSuccessMessage("");
  };

  const addVehicle = (event) => {
    event.preventDefault();

    if (!newVehicle.make.trim() || !newVehicle.model.trim()) {
      setErrorMessage("Please enter your vehicle make and model.");
      return;
    }

    const vehicle = normalizeVehicle({
      ...newVehicle,
      id: `local-${Date.now()}`,
      odometer: Number(newVehicle.odometer) || 0,
      health: "Not checked",
    });

    setVehicles((previous) => [...previous, vehicle]);
    setSelectedVehicleId(vehicle.id);
    setShowVehicleModal(false);
    setNewVehicle({
      make: "",
      model: "",
      registrationNumber: "",
      vin: "",
      odometer: "",
    });
    setErrorMessage("");
    setSuccessMessage("Vehicle added for this booking session.");
  };

  const confirmBooking = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedVehicleId) {
      setErrorMessage("Please select a vehicle.");
      setCurrentStep(1);
      return;
    }

    if (selectedServiceIds.length === 0) {
      setErrorMessage("Please select at least one service package.");
      setCurrentStep(2);
      return;
    }

    if (!date || !time) {
      setShowSlotModal(true);
      setCurrentStep(3);
      return;
    }

    setSubmitting(true);

    const payload = {
      vehicleId: selectedVehicleId,
      serviceIds: selectedServiceIds,
      services: selectedServices.map((service) => ({
        serviceId: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
      })),
      appointmentDate: date,
      timeSlot: time,
      notes: notes.trim(),
      estimatedSubtotal: selectedServices.reduce(
        (total, service) => total + service.price,
        0
      ),
      estimatedTax:
        selectedServices.reduce((total, service) => total + service.price, 0) *
        0.08,
    };

    try {
      /*
       * Expected integration:
       * POST /api/bookings
       *
       * Adjust the payload if your backend Booking model expects different
       * property names. The backend must validate prices, ownership and slots.
       */
      const response = await api.post("/bookings", payload);
      const data = response.data?.data ?? response.data;

      setSuccessMessage("Your booking request has been submitted successfully.");

      navigate("/customer/bookings", {
        state: {
          booking: data,
          bookingPayload: payload,
          demo: false,
        },
      });
    } catch (error) {
      const status = error.response?.status;

      if (!error.response) {
        setErrorMessage(
          "Could not connect to the booking server. Your booking was not submitted. Please start the backend and try again."
        );
      } else if (status === 404) {
        setErrorMessage(
          "The booking API endpoint was not found. Please connect POST /api/bookings in your backend before confirming a real booking."
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "The booking could not be submitted. Please check your details and try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSlot = () => {
    if (!date || !time) return;

    setShowSlotModal(false);
    setCurrentStep(3);
    setErrorMessage("");
    setSuccessMessage("Preferred appointment slot selected.");
  };

  return (
    <div className="min-h-full bg-[#f7f8fd]">
      <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-[26px]">
        {/* Page heading */}
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#d3d7e0] pb-5 xl:flex-row xl:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] text-[#555a62]">
              <span>Customer Portal</span>
              <span>›</span>
              <span className="font-bold text-[#102338]">Book a Service</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#102338] sm:text-[28px]">
              Book Your Vehicle Service
            </h1>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-[#555a62] sm:text-[13px]">
              Select your vehicle, choose required maintenance packages, and
              pick your preferred workshop time slot.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cbd1dc] bg-[#eaf1ff] px-3 py-1.5 text-[10px] font-semibold text-[#416995]">
            <span className="h-2 w-2 rounded-full bg-[#ed5b00]" />
            Booking Session Active
          </span>
        </div>

        <StepIndicator currentStep={currentStep} />

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-xs leading-5 text-green-800"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {loading && (
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <LoaderCircle size={15} className="animate-spin" />
            Checking your vehicles and service packages...
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_265px] 2xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* Left content */}
          <div className="min-w-0">
            <VehicleCard
              vehicle={selectedVehicle}
              onChangeVehicle={() => setCurrentStep(1)}
              onAddVehicle={() => setShowVehicleModal(true)}
            />

            {currentStep === 1 && (
              <section className="mb-5 rounded-xl border border-[#cdd2dc] bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#102338]">
                      Select Your Vehicle
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose the vehicle you want to service.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowVehicleModal(true)}
                    className="inline-flex items-center gap-1 rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-[#ed5b00]"
                  >
                    <Plus size={14} />
                    Add Vehicle
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                      className={`rounded-xl border-2 p-4 text-left ${
                        selectedVehicleId === vehicle.id
                          ? "border-[#ed5b00] bg-orange-50/50"
                          : "border-slate-200 hover:border-orange-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CarFront size={22} className="text-[#102338]" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#102338]">
                            {vehicle.model}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {vehicle.registrationNumber}
                          </p>
                        </div>

                        {selectedVehicleId === vehicle.id && (
                          <CheckCircle2
                            size={17}
                            className="ml-auto shrink-0 text-[#ed5b00]"
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ed5b00] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#d65000]"
                >
                  Continue to Services
                  <ArrowRight size={15} />
                </button>
              </section>
            )}

            {currentStep !== 1 && (
              <section className="rounded-xl border border-[#cdd2dc] bg-white p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-4 border-b border-[#d9dde5] pb-4 lg:flex-row lg:items-center">
                  <div>
                    <h2 className="text-base font-extrabold text-[#102338]">
                      Select Required Services
                    </h2>
                    <p className="mt-1 text-[11px] leading-4 text-[#555a62]">
                      Recommended routine maintenance
                      <br className="hidden sm:block" /> & diagnostic inspections
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition ${
                          category === item
                            ? "bg-[#102338] text-white"
                            : "bg-[#eef3ff] text-[#404b5a] hover:bg-blue-100"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {currentStep === 3 && (
                  <div className="mt-4 flex flex-col gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#102338]">
                        Step 3: Choose your preferred slot
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        Select a date and time to continue.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowSlotModal(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ed5b00] px-3 py-2 text-[11px] font-bold text-white"
                    >
                      <Calendar size={14} />
                      {date && time ? "Edit Date & Time" : "Choose Date & Time"}
                    </button>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedServiceIds.includes(service.id)}
                      onToggle={() => toggleService(service.id)}
                    />
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No packages found in this category.
                  </div>
                )}

                <div className="mt-5 border-t border-[#d9dde5] pt-4">
                  <label
                    htmlFor="booking-notes"
                    className="flex items-center gap-2 text-[11px] font-bold text-[#102338]"
                  >
                    <ListFilter size={15} className="text-[#416995]" />
                    Additional Notes or Specific Symptoms (Optional)
                  </label>

                  <textarea
                    id="booking-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="e.g. Squeaking noise when braking at low speeds, slight steering pull to the right..."
                    className="mt-2 w-full resize-y rounded-lg border border-[#cdd2dc] bg-white px-3 py-3 text-xs leading-5 text-[#26364b] outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />

                  <p className="mt-1 text-[9px] leading-4 text-[#555a62]">
                    Our service advisors and certified technicians can review
                    your notes before starting work.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft size={14} />
                    Change Vehicle
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(3);
                      setShowSlotModal(true);
                    }}
                    disabled={selectedServiceIds.length === 0}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#102338] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#183b58] disabled:opacity-50"
                  >
                    Continue to Date & Time
                    <ArrowRight size={14} />
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Right booking summary */}
          <div className="space-y-4">
            <BookingSummary
              vehicle={selectedVehicle}
              selectedServices={selectedServices}
              date={date}
              time={time}
              onEditSlot={() => {
                setCurrentStep(3);
                setShowSlotModal(true);
              }}
              onConfirm={confirmBooking}
              submitting={submitting}
              onRemoveService={toggleService}
            />

            <section className="flex items-center gap-3 rounded-xl border border-[#cdd2dc] bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-[#416995]">
                <MapPin size={19} />
              </div>

              <div>
                <h3 className="text-[11px] font-extrabold text-[#102338]">
                  Need advice from a service advisor?
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-[#555a62]">
                  Call workshop hotline:{" "}
                  <span className="font-bold text-[#102338]">
                    +94-7652 256984
                  </span>
                </p>
              </div>
            </section>

            <div className="flex items-start gap-2 rounded-lg border border-[#dce3ef] bg-[#eef3ff] p-3 text-[10px] leading-4 text-[#416995]">
              <Sparkles size={14} className="mt-0.5 shrink-0" />
              <p>
                Estimated duration:{" "}
                <strong>{totalDuration} minutes</strong>. Actual completion
                time may depend on workshop inspection and availability.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Date/time selection modal */}
      {showSlotModal && (
        <SlotModal
          date={date}
          time={time}
          onDateChange={setDate}
          onTimeChange={setTime}
          onClose={() => setShowSlotModal(false)}
          onSave={handleSaveSlot}
        />
      )}

      {/* Add vehicle modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-vehicle-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="add-vehicle-title"
                  className="text-lg font-extrabold text-[#102338]"
                >
                  Add Your Vehicle
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add vehicle details for this booking session.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowVehicleModal(false)}
                aria-label="Close add vehicle form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addVehicle} className="mt-5 space-y-3">
              {[
                ["make", "Vehicle Make", "e.g. BMW"],
                ["model", "Vehicle Model", "e.g. 2022 BMW X3"],
                ["registrationNumber", "Registration Number", "e.g. WP CBG-4892"],
                ["vin", "VIN (Optional)", "Vehicle identification number"],
                ["odometer", "Odometer (km)", "e.g. 42350"],
              ].map(([field, label, placeholder]) => (
                <label key={field} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {label}
                  </span>

                  <input
                    type={field === "odometer" ? "number" : "text"}
                    min={field === "odometer" ? 0 : undefined}
                    required={["make", "model"].includes(field)}
                    value={newVehicle[field]}
                    onChange={(event) =>
                      setNewVehicle((previous) => ({
                        ...previous,
                        [field]: event.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className="h-10 w-full rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="h-10 flex-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 flex-1 rounded-lg bg-[#ed5b00] text-xs font-bold text-white hover:bg-[#d65000]"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
