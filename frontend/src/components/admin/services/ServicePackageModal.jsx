
import { useEffect, useMemo, useState } from "react";

import {
  X,
  Wrench,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Plus,
  Check,
  Trash2,
  ReceiptText,
  Clock,
} from "lucide-react";

import {
  bayTypes,
  certificationOptions,
  formatCurrency,
} from "../../../data/serviceCatalogData";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  bayType: bayTypes[0],
  duration: 60,
  baseLaborCost: 0,
  partsCost: 0,
  certification: certificationOptions[0],
  description: "",
  checkpoints: [],
  status: "Draft",
};

export default function ServicePackageModal({
  isOpen,
  onClose,
  categories,
  editingPackage,
  defaultCategory,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm);
  const [newCheckpoint, setNewCheckpoint] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (editingPackage) {
      setForm({
        ...emptyForm,
        ...editingPackage,
        checkpoints: [...(editingPackage.checkpoints || [])],
      });
    } else {
      setForm({
        ...emptyForm,
        category:
          defaultCategory?.id ||
          categories[0]?.id ||
          "",
        bayType:
          defaultCategory?.bayType ||
          bayTypes[0],
        sku: `SRV-${Date.now().toString().slice(-6)}`,
      });
    }

    setNewCheckpoint("");
    setError("");
  }, [isOpen, editingPackage, defaultCategory, categories]);

  const total = useMemo(
    () =>
      Number(form.baseLaborCost || 0) +
      Number(form.partsCost || 0),
    [form.baseLaborCost, form.partsCost]
  );

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addCheckpoint = () => {
    const value = newCheckpoint.trim();

    if (!value) return;

    if (form.checkpoints.includes(value)) {
      setError("This checkpoint already exists.");
      return;
    }

    setForm((previous) => ({
      ...previous,
      checkpoints: [...previous.checkpoints, value],
    }));

    setNewCheckpoint("");
    setError("");
  };

  const removeCheckpoint = (index) => {
    setForm((previous) => ({
      ...previous,
      checkpoints: previous.checkpoints.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const submitForm = async (event, status) => {
    event.preventDefault();

    if (!form.name.trim() || !form.sku.trim() || !form.category) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      Number(form.duration) <= 0 ||
      Number(form.baseLaborCost) < 0 ||
      Number(form.partsCost) < 0
    ) {
      setError("Please enter valid duration and pricing values.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        duration: Number(form.duration),
        baseLaborCost: Number(form.baseLaborCost),
        partsCost: Number(form.partsCost),
        totalPrice: total,
        status,
      });

      onClose();
    } catch (err) {
      setError(
        err.message || "Unable to save service package."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#172c43] outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "mb-2 block text-xs font-bold text-[#172c43]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-3 py-5 backdrop-blur-[3px] sm:px-5 sm:py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="my-auto flex max-h-[94vh] w-full max-w-[850px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* MODAL HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
              <Wrench size={21} className="text-orange-600" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#172c43]">
                {editingPackage
                  ? "Edit Service Package"
                  : "Add New Service Package"}
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Define package specifications, technician tier
                requirements, labor pricing, and bay allocation rules.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
          >
            <X size={21} />
          </button>
        </div>

        {/* MODAL FORM */}
        <form
          onSubmit={(event) => submitForm(event, "Active")}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <div className="space-y-5">

            {/* PACKAGE NAME */}
            <div>
              <label className={labelClass}>
                Service Package Name <span className="text-red-500">*</span>
              </label>

              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter service package name"
                className={inputClass}
              />
            </div>

            {/* SKU + CATEGORY */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Service Code / SKU <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <QrCode
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    value={form.sku}
                    onChange={(e) =>
                      updateField("sku", e.target.value)
                    }
                    placeholder="SRV-EV-9402"
                    className={`${inputClass} bg-slate-50 pl-10 font-mono font-bold`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Service Category <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <select
                    required
                    value={form.category}
                    onChange={(e) => {
                      const selected = categories.find(
                        (item) => item.id === e.target.value
                      );

                      updateField("category", e.target.value);

                      if (selected) {
                        updateField("bayType", selected.bayType);
                      }
                    }}
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* BAY + DURATION */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Recommended Bay Type <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <select
                    value={form.bayType}
                    onChange={(e) =>
                      updateField("bayType", e.target.value)
                    }
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    {bayTypes.map((bay) => (
                      <option key={bay} value={bay}>
                        {bay}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Estimated Duration
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Clock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="1"
                      required
                      value={form.duration}
                      onChange={(e) =>
                        updateField("duration", e.target.value)
                      }
                      className={`${inputClass} pl-9`}
                    />
                  </div>

                  <span className="flex items-center rounded-lg border border-slate-200 bg-blue-50 px-4 text-xs font-semibold text-slate-600">
                    Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* PRICE CALCULATION */}
            <div className="grid grid-cols-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto_1fr_auto_1.1fr]">
              <div>
                <label className={labelClass}>
                  Base Labor Cost (Rs.)
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={form.baseLaborCost}
                  onChange={(e) =>
                    updateField("baseLaborCost", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <span className="hidden text-xl font-bold text-slate-400 sm:block">
                +
              </span>

              <div>
                <label className={labelClass}>
                  OEM Parts & Consumables (Rs.)
                </label>

                <input
                  type="number"
                  min="0"
                  required
                  value={form.partsCost}
                  onChange={(e) =>
                    updateField("partsCost", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <span className="hidden text-xl font-bold text-slate-400 sm:block">
                =
              </span>

              <div className="rounded-lg border border-orange-200 bg-white p-3">
                <p className="text-[9px] font-bold tracking-wider text-slate-500">
                  PACKAGE TOTAL
                </p>

                <p className="mt-1 text-xl font-extrabold text-orange-600">
                  {formatCurrency(total)}
                </p>

                <ReceiptText
                  size={14}
                  className="mt-1 text-orange-500"
                />
              </div>
            </div>

            {/* CERTIFICATION */}
            <div>
              <label className={labelClass}>
                Minimum Technician Certification Required
              </label>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  value={form.certification}
                  onChange={(e) =>
                    updateField("certification", e.target.value)
                  }
                  className={`${inputClass} appearance-none pl-10 pr-9`}
                >
                  {certificationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelClass}>
                Service Description & Bay Inspection Scope
              </label>

              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Describe the service, technical inspection and work scope..."
                className={`${inputClass} resize-y leading-6`}
              />
            </div>

            {/* CHECKPOINTS */}
            <div>
              <label className={labelClass}>
                Service Checkpoints & Inclusions (Client Visible)
              </label>

              <div className="flex flex-wrap gap-2">
                {form.checkpoints.map((checkpoint, index) => (
                  <span
                    key={`${checkpoint}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-emerald-700"
                  >
                    <Check size={12} />

                    {checkpoint}

                    <button
                      type="button"
                      onClick={() => removeCheckpoint(index)}
                      className="text-emerald-600 hover:text-red-600"
                      title="Remove checkpoint"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("checkpoint-input")
                      ?.focus();
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-500 hover:border-orange-400 hover:text-orange-600"
                >
                  <Plus size={12} />
                  Add Checkpoint
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  id="checkpoint-input"
                  value={newCheckpoint}
                  onChange={(e) =>
                    setNewCheckpoint(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCheckpoint();
                    }
                  }}
                  placeholder="Enter a new service checkpoint..."
                  className={`${inputClass} flex-1`}
                />

                <button
                  type="button"
                  onClick={addCheckpoint}
                  className="rounded-lg bg-[#10243b] px-4 text-xs font-bold text-white hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className={labelClass}>
                Package Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
                className={inputClass}
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="sticky bottom-[-1.25rem] mt-6 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 bg-white py-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                disabled={saving}
                onClick={(event) => submitForm(event, "Draft")}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#ff6b1a] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingPackage ? "Update Service Package" : "Publish Service Package"}

                <span>→</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
