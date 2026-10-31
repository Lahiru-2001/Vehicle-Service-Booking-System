
import { useEffect, useState } from "react";
import { X, FolderPlus } from "lucide-react";

import { bayTypes } from "../../../data/serviceCatalogData";

const emptyCategory = {
  name: "",
  description: "",
  bayType: bayTypes[0],
  icon: "car-front",
  color: "blue",
  status: "Active",
};

export default function ServiceCategoryModal({
  isOpen,
  onClose,
  editingCategory,
  onSave,
}) {
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      editingCategory
        ? { ...emptyCategory, ...editingCategory }
        : emptyCategory
    );

    setError("");
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        ...form,
        name: form.name.trim(),
      });

      onClose();
    } catch (err) {
      setError(err.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <FolderPlus size={20} />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-[#172c43]">
                {editingCategory ? "Edit Service Category" : "Add New Service Category"}
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Configure category information and workshop allocation.
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={19} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Category Name *
            </label>

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="e.g. Brake Systems"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Description
            </label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe this service category..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Recommended Workshop Bay
            </label>

            <select
              value={form.bayType}
              onChange={(e) =>
                setForm({ ...form, bayType: e.target.value })
              }
              className={inputClass}
            >
              {bayTypes.map((bay) => (
                <option key={bay} value={bay}>
                  {bay}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Icon
              </label>

              <select
                value={form.icon}
                onChange={(e) =>
                  setForm({ ...form, icon: e.target.value })
                }
                className={inputClass}
              >
                <option value="car-front">Vehicle</option>
                <option value="oil">Oil</option>
                <option value="activity">Diagnostics</option>
                <option value="zap">Electrical / EV</option>
                <option value="disc">Tires</option>
                <option value="wind">HVAC</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-700">
                Theme Color
              </label>

              <select
                value={form.color}
                onChange={(e) =>
                  setForm({ ...form, color: e.target.value })
                }
                className={inputClass}
              >
                <option value="red">Red</option>
                <option value="amber">Amber</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="cyan">Cyan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#ff6b1a] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
