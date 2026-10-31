
import { useEffect, useState } from "react";
import { CalendarPlus, X } from "lucide-react";

export default function CustomerBookingModal({
  isOpen,
  onClose,
  customer,
  onSave,
}) {
  const [form, setForm] = useState({
    vehicleId: "",
    serviceDate: "",
    serviceTime: "",
    servicePackage: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm({
        vehicleId: customer?.vehicles?.[0]?.id || "",
        serviceDate: "",
        serviceTime: "",
        servicePackage: "",
        notes: "",
      });
      setError("");
    }
  }, [isOpen, customer]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.vehicleId ||
      !form.serviceDate ||
      !form.serviceTime ||
      !form.servicePackage
    ) {
      setError("Please complete all required booking details.");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        customerId: customer.id,
        vehicleId: form.vehicleId,
        serviceDate: form.serviceDate,
        serviceTime: form.serviceTime,
        servicePackage: form.servicePackage,
        notes: form.notes,
      });
    } catch (err) {
      setError(err.message || "Unable to create booking.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400";

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <CalendarPlus size={20} />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-[#10243b]">
                Create Service Booking
              </h2>
              <p className="text-[10px] text-slate-500">
                Customer: {customer?.fullName}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={19} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-xs font-bold">
              Customer
            </label>
            <input
              disabled
              value={customer?.fullName || ""}
              className={`${inputClass} bg-slate-50`}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Registered Vehicle *
            </label>

            <select
              required
              value={form.vehicleId}
              onChange={(e) =>
                setForm({ ...form, vehicleId: e.target.value })
              }
              className={inputClass}
            >
              <option value="">Select vehicle</option>

              {customer?.vehicles?.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.plate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Service Package *
            </label>

            <input
              required
              value={form.servicePackage}
              onChange={(e) =>
                setForm({ ...form, servicePackage: e.target.value })
              }
              placeholder="Enter or select service package"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-bold">
                Booking Date *
              </label>

              <input
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.serviceDate}
                onChange={(e) =>
                  setForm({ ...form, serviceDate: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold">
                Booking Time *
              </label>

              <input
                required
                type="time"
                value={form.serviceTime}
                onChange={(e) =>
                  setForm({ ...form, serviceTime: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Additional Notes
            </label>

            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              placeholder="Additional service requirements..."
              className={inputClass}
            />
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
              {saving ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
