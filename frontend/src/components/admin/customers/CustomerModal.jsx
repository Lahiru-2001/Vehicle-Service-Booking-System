
import { useEffect, useState } from "react";
import { X, UserRound } from "lucide-react";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  customerType: "Individual",
  tier: "Standard",
};

export default function CustomerModal({
  isOpen,
  onClose,
  customer,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      customer
        ? {
            ...emptyForm,
            ...customer,
            firstName:
              customer.firstName ||
              customer.fullName?.split(" ")[0] ||
              "",
            lastName:
              customer.lastName ||
              customer.fullName?.split(" ").slice(1).join(" ") ||
              "",
          }
        : emptyForm
    );

    setError("");
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

    if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please complete the required customer details.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      });
    } catch (err) {
      setError(err.message || "Unable to save customer.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-[#10243b]">
                {customer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <p className="text-[10px] text-slate-500">
                Manage customer contact and account information.
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={19} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold">
                First Name *
              </label>
              <input
                required
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={inputClass}
                placeholder="First name"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold">
                Last Name
              </label>
              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={inputClass}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Phone Number *
            </label>
            <input
              required
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="+94 77 123 4567"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              className={inputClass}
              placeholder="Customer location"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold">
                Customer Type
              </label>

              <select
                value={form.customerType}
                onChange={(e) => updateField("customerType", e.target.value)}
                className={inputClass}
              >
                <option value="Individual">Individual</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold">
                Loyalty Tier
              </label>

              <select
                value={form.tier}
                onChange={(e) => updateField("tier", e.target.value)}
                className={inputClass}
              >
                <option value="Standard">Standard</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="VIP">VIP</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
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
              {saving ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
