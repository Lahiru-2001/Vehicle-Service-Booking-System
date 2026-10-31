
import { useEffect, useState } from "react";
import { X, CarFront } from "lucide-react";

const emptyVehicle = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  plate: "",
  vin: "",
  mileage: "",
  status: "Healthy",
};

export default function VehicleModal({
  isOpen,
  onClose,
  customer,
  onSave,
}) {
  const [form, setForm] = useState(emptyVehicle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(emptyVehicle);
      setError("");
    }
  }, [isOpen, customer]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.make.trim() || !form.model.trim() || !form.plate.trim()) {
      setError("Vehicle make, model and registration are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        ...form,
        year: Number(form.year),
        mileage: form.mileage ? `${form.mileage} km` : "N/A",
      });
    } catch (err) {
      setError(err.message || "Unable to add vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <CarFront size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#10243b]">
                Add Registered Vehicle
              </h2>
              <p className="text-[10px] text-slate-500">
                Customer: {customer?.fullName || customer?.email}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={19} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-bold">
                Vehicle Make *
              </label>
              <input
                required
                value={form.make}
                onChange={(e) => updateField("make", e.target.value)}
                placeholder="BMW"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold">
                Vehicle Model *
              </label>
              <input
                required
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
                placeholder="X3 M-Sport"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-bold">
                Manufacturing Year
              </label>
              <input
                type="number"
                min="1950"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold">
                Registration Number *
              </label>
              <input
                required
                value={form.plate}
                onChange={(e) => updateField("plate", e.target.value)}
                placeholder="ABC-1234"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              VIN Number
            </label>
            <input
              value={form.vin}
              onChange={(e) => updateField("vin", e.target.value)}
              placeholder="Enter vehicle VIN"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Current Mileage (km)
            </label>
            <input
              type="number"
              min="0"
              value={form.mileage}
              onChange={(e) => updateField("mileage", e.target.value)}
              placeholder="18200"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Vehicle Condition
            </label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className={inputClass}
            >
              <option value="Healthy">Healthy</option>
              <option value="Needs Inspection">Needs Inspection</option>
              <option value="Maintenance Due">Maintenance Due</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2.5 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#ff6b1a] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
