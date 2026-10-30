import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Tag,
  Radio,
  CarFront,
  Pencil,
  Plus,
  CheckCircle2,
  BatteryCharging,
  Gauge,
  Wrench,
  Clock,
  X,
  Save,
  LoaderCircle,
  AlertCircle,
  ClipboardList,
  RotateCcw,
} from "lucide-react";

import api from "../../api/client";

const initialProfile = {
  firstName: "Kasun",
  lastName: "Rathnayake",
  email: "kasun.r@example.com",
  phone: "+94-752369845",
  address: "Dankotuwa, Sri Lanka",
  license: "076582963",
  memberSince: "March 2023",
};

const initialVehicles = [
  {
    id: "vehicle-1",
    make: "BMW",
    model: "X3 M-Sport",
    year: "2021",
    plate: "WP CBG-4892",
    vin: "WBA53DP09M488402",
    odometer: "42150",
    fuel: "Gasoline Turbo (xDrive)",
    driver: "Kasun Rathnayake",
    notes:
      "Prefers Motul 5W-40 full synthetic, OEM brake pads only, ceramic coated windshield.",
    insurance: "Sri Lanka Insurance",
    insurancePhone: "45263-8596",
    condition: "Good Standing",
    primary: true,
    metricLabel: "Oil Life",
    metricValue: "84% Capacity",
    metricNote: "Motul 5W-40 synth",
    serviceLabel: "Next Service Due",
    serviceValue: "Oct 25, 2025",
    serviceNote: "or at 45,000 km",
    battery: "Battery 12.8V (Normal)",
    tires: "Tires 34 PSI (Calibrated)",
    history: 8,
  },
  {
    id: "vehicle-2",
    make: "Toyota",
    model: "RAV4 Prime",
    year: "2023",
    plate: "WP CAD-1205",
    vin: "4T1C11AK8P00010492",
    odometer: "18200",
    fuel: "Plug-in Hybrid",
    driver: "Kasun Rathnayake",
    notes: "",
    insurance: "",
    insurancePhone: "",
    condition: "Service Pending (14 Days)",
    primary: false,
    metricLabel: "Hybrid Battery",
    metricValue: "97% SOH",
    metricNote: "Optimal condition",
    serviceLabel: "Annual Inspection",
    serviceValue: "Due in 14 days",
    serviceNote: "Booking recommended",
    battery: "Hybrid battery healthy",
    tires: "Tires calibrated",
    history: 4,
  },
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-[#f7f8fd] px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const labelClass = "block text-xs font-semibold text-slate-700";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`my-auto w-full ${
          wide ? "max-w-3xl" : "max-w-xl"
        } overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[#0c2034] px-5 py-4 text-white sm:px-6">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-1 text-xs text-slate-300">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ children, warning = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
        warning
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          warning ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {children}
    </span>
  );
}

function SummaryTile({ icon: Icon, title, value, note, orange = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-[#eef3ff] p-3 sm:p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ${
          orange ? "text-orange-500" : "text-[#102338]"
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{title}</p>
        <p className="text-sm font-bold text-[#102338]">{value}</p>
        {note && <p className="mt-0.5 text-[10px] text-slate-500">{note}</p>}
      </div>
    </div>
  );
}

function MetricTile({ title, value, note, warning = false }) {
  return (
    <div className="min-w-0 rounded-lg bg-[#eef3ff] p-3">
      <p className="text-[11px] text-slate-600">{title}</p>
      <p
        className={`mt-0.5 text-sm font-bold ${
          warning ? "text-amber-700" : "text-[#102338]"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-[10px] ${
          warning ? "text-amber-700" : "text-slate-500"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

function VehicleForm({
  initialData,
  onCancel,
  onSave,
  saving,
  editing,
}) {
  const [form, setForm] = useState(() => ({
    make: initialData?.make ?? "",
    model: initialData?.model ?? "",
    year: initialData?.year ?? "",
    plate: initialData?.plate ?? "",
    vin: initialData?.vin ?? "",
    odometer: initialData?.odometer ?? "",
    fuel: initialData?.fuel ?? "",
    driver: initialData?.driver ?? "",
    notes: initialData?.notes ?? "",
    insurance: initialData?.insurance ?? "",
    insurancePhone: initialData?.insurancePhone ?? "",
  }));

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Vehicle Make"
          name="make"
          value={form.make}
          onChange={update}
          placeholder="e.g. BMW"
          required
        />

        <Field
          label="Model & Trim"
          name="model"
          value={form.model}
          onChange={update}
          placeholder="e.g. X3 M-Sport"
          required
        />

        <Field
          label="Manufacturing Year"
          name="year"
          value={form.year}
          onChange={update}
          placeholder="2024"
          type="number"
          required
        />

        <Field
          label="License Plate Number"
          name="plate"
          value={form.plate}
          onChange={update}
          placeholder="WP ABC-1234"
          required
        />

        <Field
          label="Vehicle Identification Number (VIN)"
          name="vin"
          value={form.vin}
          onChange={update}
          placeholder="Enter VIN"
          required
          className="sm:col-span-2"
        />

        <Field
          label="Current Odometer (km)"
          name="odometer"
          value={form.odometer}
          onChange={update}
          placeholder="e.g. 42150"
          type="number"
          required
        />

        <label className="block">
          <span className={labelClass}>Drivetrain / Fuel Type</span>
          <select
            name="fuel"
            value={form.fuel}
            onChange={update}
            className={inputClass}
            required
          >
            <option value="">Select type</option>
            <option>Gasoline</option>
            <option>Gasoline Turbo (xDrive)</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Plug-in Hybrid</option>
            <option>Electric</option>
          </select>
        </label>

        <Field
          label="Primary Driver"
          name="driver"
          value={form.driver}
          onChange={update}
          placeholder="Driver's name"
          className="sm:col-span-2"
        />

        <label className="block sm:col-span-2">
          <span className={labelClass}>Workshop Service Notes & Fluid Specs</span>
          <textarea
            name="notes"
            value={form.notes}
            onChange={update}
            rows={3}
            placeholder="Preferred oil, service requirements, and other notes..."
            className={inputClass}
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-[#eef3ff] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#102338]">
            Insurance & Roadside Dispatch
          </h3>
          <span className="text-[10px] font-semibold text-emerald-700">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Insurance Provider"
            name="insurance"
            value={form.insurance}
            onChange={update}
            placeholder="Insurance company"
          />

          <Field
            label="Insurance / Roadside Contact"
            name="insurancePhone"
            value={form.insurancePhone}
            onChange={update}
            placeholder="Contact number"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : editing ? "Save Changes" : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}

export default function MyProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(initialProfile);
  const [vehicles, setVehicles] = useState(initialVehicles);

  const [profileForm, setProfileForm] = useState(initialProfile);
  const [modal, setModal] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [apiError, setApiError] = useState("");

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setApiError("");

      try {
        /*
          Optional backend endpoints:
          GET /api/customer/profile
          GET /api/customer/vehicles

          Adapt these paths to match your backend routes.
        */
        const [profileResult, vehicleResult] = await Promise.allSettled([
          api.get("/customer/profile"),
          api.get("/customer/vehicles"),
        ]);

        if (!active) return;

        if (profileResult.status === "fulfilled") {
          const response = profileResult.value.data;
          const data = response.profile ?? response.customer ?? response.data ?? response;

          if (data && typeof data === "object") {
            const nameParts = String(data.name ?? "").split(" ");

            setProfile((current) => ({
              ...current,
              ...data,
              firstName: data.firstName ?? nameParts[0] ?? current.firstName,
              lastName:
                data.lastName ??
                nameParts.slice(1).join(" ") ??
                current.lastName,
              address: data.address ?? data.residentialAddress ?? current.address,
              license: data.license ?? data.drivingLicense ?? current.license,
            }));
          }
        }

        if (vehicleResult.status === "fulfilled") {
          const response = vehicleResult.value.data;
          const data = response.vehicles ?? response.data ?? response;

          if (Array.isArray(data)) {
            setVehicles(
              data.map((vehicle, index) => ({
                ...initialVehicles[index % initialVehicles.length],
                ...vehicle,
                id: vehicle.id ?? vehicle._id ?? `vehicle-${index + 1}`,
                make: vehicle.make ?? vehicle.brand ?? "",
                model: vehicle.model ?? "",
                year: String(vehicle.year ?? ""),
                plate: vehicle.plate ?? vehicle.licensePlate ?? "",
                vin: vehicle.vin ?? "",
                odometer: String(vehicle.odometer ?? ""),
                fuel: vehicle.fuel ?? vehicle.fuelType ?? "",
              })),
            );
          }
        }
      } catch {
        if (active) {
          setApiError(
            "Could not load profile data from the server. Sample data is shown.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const openProfileEditor = () => {
    setProfileForm({ ...profile });
    setModal("profile");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setApiError("");

    try {
      /*
        Optional backend endpoint:
        PUT /api/customer/profile
      */
      await api.put("/customer/profile", {
        ...profileForm,
        name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
        residentialAddress: profileForm.address,
        drivingLicense: profileForm.license,
      });

      setProfile({ ...profileForm });
      setModal(null);
      setNotice("Your profile was saved successfully.");
    } catch (error) {
      /*
        Keep the UI usable during frontend development.
        Replace this fallback with an error message if you require
        successful persistence to the backend before saving locally.
      */
      if (!error.response) {
        setProfile({ ...profileForm });
        setModal(null);
        setNotice("Profile updated locally. The server was unavailable.");
      } else {
        setApiError(
          error.response?.data?.message ||
            "Unable to save the profile. Check your backend endpoint.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const openAddVehicle = () => {
    setSelectedVehicle(null);
    setModal("addVehicle");
  };

  const openEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModal("editVehicle");
  };

  const saveVehicle = async (form) => {
    setSaving(true);
    setApiError("");

    const isEditing = modal === "editVehicle";

    try {
      let savedVehicle;

      if (isEditing) {
        /*
          Optional backend endpoint:
          PUT /api/customer/vehicles/:id
        */
        const response = await api.put(
          `/customer/vehicles/${selectedVehicle.id}`,
          form,
        );
        savedVehicle =
          response.data.vehicle ?? response.data.data ?? response.data;
      } else {
        /*
          Optional backend endpoint:
          POST /api/customer/vehicles
        */
        const response = await api.post("/customer/vehicles", form);
        savedVehicle =
          response.data.vehicle ?? response.data.data ?? response.data;
      }

      const vehicle = {
        ...(isEditing ? selectedVehicle : {}),
        ...form,
        ...savedVehicle,
        id:
          savedVehicle.id ??
          savedVehicle._id ??
          selectedVehicle?.id ??
          `vehicle-${Date.now()}`,
        year: String(savedVehicle.year ?? form.year),
        odometer: String(savedVehicle.odometer ?? form.odometer),
        primary: isEditing
          ? selectedVehicle.primary
          : vehicles.length === 0,
        condition: savedVehicle.condition ?? "Good Standing",
        metricLabel: savedVehicle.metricLabel ?? "Vehicle Status",
        metricValue: savedVehicle.metricValue ?? "Registered",
        metricNote: savedVehicle.metricNote ?? "Vehicle profile saved",
        serviceLabel: savedVehicle.serviceLabel ?? "Next Service Due",
        serviceValue: savedVehicle.serviceValue ?? "To be scheduled",
        serviceNote: savedVehicle.serviceNote ?? "Contact your workshop",
        battery: savedVehicle.battery ?? "Check during next service",
        tires: savedVehicle.tires ?? "Check during next service",
        history: savedVehicle.history ?? 0,
      };

      if (isEditing) {
        setVehicles((current) =>
          current.map((item) =>
            String(item.id) === String(selectedVehicle.id) ? vehicle : item,
          ),
        );
      } else {
        setVehicles((current) => [...current, vehicle]);
      }

      setModal(null);
      setSelectedVehicle(null);
      setNotice(
        isEditing
          ? "Vehicle details updated successfully."
          : "New vehicle added successfully.",
      );
    } catch (error) {
      if (!error.response) {
        const vehicle = {
          ...form,
          id: selectedVehicle?.id ?? `vehicle-${Date.now()}`,
          primary: selectedVehicle?.primary ?? vehicles.length === 0,
          condition: selectedVehicle?.condition ?? "Good Standing",
          metricLabel: selectedVehicle?.metricLabel ?? "Vehicle Status",
          metricValue: selectedVehicle?.metricValue ?? "Registered",
          metricNote: selectedVehicle?.metricNote ?? "Vehicle profile saved",
          serviceLabel: selectedVehicle?.serviceLabel ?? "Next Service Due",
          serviceValue: selectedVehicle?.serviceValue ?? "To be scheduled",
          serviceNote: selectedVehicle?.serviceNote ?? "Contact your workshop",
          battery: selectedVehicle?.battery ?? "Check during next service",
          tires: selectedVehicle?.tires ?? "Check during next service",
          history: selectedVehicle?.history ?? 0,
        };

        setVehicles((current) =>
          isEditing
            ? current.map((item) =>
                String(item.id) === String(selectedVehicle.id) ? vehicle : item,
              )
            : [...current, vehicle],
        );

        setModal(null);
        setSelectedVehicle(null);
        setNotice(
          isEditing
            ? "Vehicle updated locally. The server was unavailable."
            : "Vehicle added locally. The server was unavailable.",
        );
      } else {
        setApiError(
          error.response?.data?.message ||
            "Unable to save the vehicle. Check your backend endpoint.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const buttonSecondary =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-[#102338] transition hover:border-slate-400 hover:bg-slate-50 sm:px-4 sm:text-sm";

  const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-orange-600 sm:px-5 sm:text-sm";

  return (
    <div className="min-h-full bg-[#f7f8fd] px-4 py-6 text-[#102338] sm:px-6 lg:px-7 lg:py-7">
      <div className="mx-auto max-w-[1500px]">
        {/* Page heading */}
        <header className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Customer Portal</span>
              <span>/</span>
              <span className="font-semibold text-slate-900">My Profile</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Account &amp; Vehicle Profile
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Manage your personal details, registered vehicle garage,
              emergency contacts, and telemetry notification preferences.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openProfileEditor}
              className={buttonSecondary}
            >
              <Pencil size={16} />
              Edit Profile Details
            </button>

            <button
              type="button"
              onClick={openAddVehicle}
              className={buttonPrimary}
            >
              <Plus size={17} />
              Add New Vehicle
            </button>
          </div>
        </header>

        {/* Alerts */}
        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="ml-auto rounded p-1 hover:bg-emerald-100"
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {apiError && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {loading && (
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <LoaderCircle size={15} className="animate-spin" />
            Loading profile information...
          </div>
        )}

        {/* Profile summary */}
        <section className="mb-6 rounded-2xl border border-slate-300 bg-gradient-to-br from-white via-white to-blue-50 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#31577d] to-[#0b2034] text-2xl font-extrabold text-white shadow-md sm:h-24 sm:w-24 sm:text-3xl">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold sm:text-2xl">
                    {fullName}
                  </h2>

                  <StatusBadge>VERIFIED VEHICLE OWNER</StatusBadge>
                </div>

                <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-blue-900">
                  <ShieldCheck size={12} />
                  AUTOCARE CLUB PLATINUM
                </div>

                <div className="mt-3 flex flex-col gap-x-4 gap-y-2 text-xs text-slate-600 sm:flex-row sm:flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} />
                    {profile.email}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={14} />
                    {profile.phone}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {profile.address}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Member Since {profile.memberSince}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-5 border-t border-slate-200 pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
              <div className="text-center">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Active Vehicles
                </p>
                <p className="text-2xl font-extrabold">
                  {vehicles.length} Units
                </p>
              </div>

              <div className="h-11 border-l border-slate-300" />

              <div className="text-center">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Completed Services
                </p>
                <p className="text-2xl font-extrabold">12 Visits</p>
              </div>
            </div>
          </div>

          <div className="my-5 border-t border-slate-200" />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SummaryTile
              icon={ShieldCheck}
              title="AutoCare Elite Warranty"
              value="Valid until Nov 2026"
            />

            <SummaryTile
              icon={Tag}
              title="Service Loyalty Balance"
              value="2,450 pts (Rs.1500 credit)"
              orange
            />

            <SummaryTile
              icon={Radio}
              title="OBD-II Cloud Telemetry"
              value="Connected (Live 60Hz)"
            />
          </div>
        </section>

        {/* Vehicle garage */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold sm:text-xl">
              Registered Garage Units
            </h2>

            <span className="text-xs text-slate-500">
              {vehicles.length} registered{" "}
              {vehicles.length === 1 ? "vehicle" : "vehicles"}
            </span>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <CarFront className="mx-auto text-slate-400" size={36} />
              <h3 className="mt-3 font-bold">No vehicles registered yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add your first vehicle to manage service details.
              </p>
              <button
                type="button"
                onClick={openAddVehicle}
                className={`${buttonPrimary} mt-4`}
              >
                <Plus size={16} />
                Add New Vehicle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <article
                  key={vehicle.id}
                  className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
                    vehicle.primary
                      ? "border-[#a8bfd5] ring-1 ring-[#d9e5f1]"
                      : "border-slate-300"
                  }`}
                >
                  {/* Vehicle heading */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#102338]">
                        <CarFront size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-extrabold sm:text-base">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>

                          {vehicle.primary && (
                            <span className="rounded-full bg-[#0c2034] px-2 py-1 text-[9px] font-bold text-white">
                              PRIMARY
                            </span>
                          )}

                          {!vehicle.primary && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-900">
                              SECONDARY
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                          <span className="rounded bg-blue-50 px-2 py-1 font-mono font-bold text-[#102338]">
                            {vehicle.plate || "Plate not provided"}
                          </span>

                          <span>
                            VIN:{" "}
                            <span className="font-medium">
                              {vehicle.vin || "Not provided"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge
                      warning={String(vehicle.condition).toLowerCase().includes(
                        "pending",
                      )}
                    >
                      {vehicle.condition || "Good Standing"}
                    </StatusBadge>
                  </div>

                  <div className="my-4 border-t border-slate-200" />

                  {/* Vehicle metrics */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <MetricTile
                      title="Odometer"
                      value={`${Number(vehicle.odometer || 0).toLocaleString()} km`}
                      note="Current recorded mileage"
                    />

                    <MetricTile
                      title={vehicle.metricLabel || "Vehicle Status"}
                      value={vehicle.metricValue || "Registered"}
                      note={vehicle.metricNote || "Vehicle profile saved"}
                    />

                    <MetricTile
                      title={vehicle.serviceLabel || "Next Service Due"}
                      value={vehicle.serviceValue || "To be scheduled"}
                      note={vehicle.serviceNote || "Contact your workshop"}
                      warning={String(vehicle.serviceValue)
                        .toLowerCase()
                        .includes("due")}
                    />
                  </div>

                  <div className="my-4 border-t border-slate-200" />

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <BatteryCharging size={14} className="text-emerald-600" />
                      {vehicle.battery || "Battery status not available"}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Gauge size={14} className="text-emerald-600" />
                      {vehicle.tires || "Tire status not available"}
                    </span>
                  </div>

                  {/* Vehicle actions */}
                  <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/customer/book-service", {
                            state: { vehicleId: vehicle.id },
                          })
                        }
                        className={buttonPrimary}
                      >
                        <Wrench size={14} />
                        Service Now
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/customer/bookings", {
                            state: { vehicleId: vehicle.id },
                          })
                        }
                        className={buttonSecondary}
                      >
                        <ClipboardList size={14} />
                        Service History ({vehicle.history ?? 0})
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditVehicle(vehicle)}
                        className={buttonSecondary}
                      >
                        <Pencil size={14} />
                        Edit Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Add vehicle call-to-action */}
          <button
            type="button"
            onClick={openAddVehicle}
            className="mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 px-5 py-8 text-center transition hover:border-orange-400 hover:bg-orange-50/50 sm:py-10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-[#102338]">
              <Plus size={24} />
            </span>

            <span className="mt-3 text-sm font-bold">
              Add Another Vehicle to Fleet
            </span>

            <span className="mt-1 max-w-md text-xs leading-5 text-slate-600">
              Connect another personal or commercial car, configure its details,
              and manage maintenance records in one place.
            </span>
          </button>
        </section>

        {/* Bottom status line */}
        <footer className="mt-7 flex flex-col justify-between gap-3 border-t border-slate-300 py-5 text-[11px] text-slate-600 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Workshop Bay 04 &amp; Diagnostic Telemetry Servers Operational
          </span>

          <span>© 2025 AutoCare Fleet Systems Inc. All rights reserved.</span>
        </footer>
      </div>

      {/* Edit profile modal */}
      {modal === "profile" && (
        <Modal
          title="Edit Profile Details"
          subtitle="Update your personal information and contact details."
          onClose={() => setModal(null)}
        >
          <form onSubmit={saveProfile} className="space-y-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#eef3ff] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c2034] text-sm font-bold text-white">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-bold">{fullName}</p>
                <p className="text-xs text-slate-500">
                  Customer profile information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="First Name"
                name="firstName"
                value={profileForm.firstName}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
                required
              />

              <Field
                label="Last Name"
                name="lastName"
                value={profileForm.lastName}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
                required
              />

              <Field
                label="Email Address"
                name="email"
                value={profileForm.email}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                type="email"
                required
              />

              <Field
                label="Phone Number"
                name="phone"
                value={profileForm.phone}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                type="tel"
                required
              />

              <Field
                label="Residential Address"
                name="address"
                value={profileForm.address}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                className="sm:col-span-2"
              />

              <Field
                label="Driving License Number"
                name="license"
                value={profileForm.license}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    license: event.target.value,
                  }))
                }
                className="sm:col-span-2"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModal(null)}
                className={buttonSecondary}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`${buttonPrimary} disabled:opacity-60`}
              >
                {saving ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add vehicle modal */}
      {modal === "addVehicle" && (
        <Modal
          title="Add New Vehicle"
          subtitle="Register a vehicle in your AutoCare garage."
          onClose={() => setModal(null)}
          wide
        >
          <VehicleForm
            initialData={null}
            onCancel={() => setModal(null)}
            onSave={saveVehicle}
            saving={saving}
            editing={false}
          />
        </Modal>
      )}

      {/* Edit vehicle modal */}
      {modal === "editVehicle" && selectedVehicle && (
        <Modal
          title="Edit Vehicle Profile"
          subtitle={`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate})`}
          onClose={() => {
            setModal(null);
            setSelectedVehicle(null);
          }}
          wide
        >
          <VehicleForm
            initialData={selectedVehicle}
            onCancel={() => {
              setModal(null);
              setSelectedVehicle(null);
            }}
            onSave={saveVehicle}
            saving={saving}
            editing
          />
        </Modal>
      )}
    </div>
  );
}
