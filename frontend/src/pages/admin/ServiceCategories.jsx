
import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Download,
  Search,
  FolderPlus,
  PackagePlus,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import api from "../../api/client";

import {
  initialCategories,
  initialPackages,
} from "../../data/serviceCatalogData";

import ServiceStats from "../../components/admin/services/ServiceStats";
import ServiceCategoryTabs from "../../components/admin/services/ServiceCategoryTabs";
import ServicePackagesTable from "../../components/admin/services/ServicePackagesTable";
import ServicePackageModal from "../../components/admin/services/ServicePackageModal";
import ServiceCategoryModal from "../../components/admin/services/ServiceCategoryModal";

export default function ServiceCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [packages, setPackages] = useState(initialPackages);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [page, setPage] = useState(1);

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [editingPackage, setEditingPackage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [defaultCategory, setDefaultCategory] = useState(null);

  const [notification, setNotification] = useState(null);

  // --------------------------------
  // NOTIFICATION
  // --------------------------------

  const notify = (message, type = "success") => {
    setNotification({ message, type });
  };

  // --------------------------------
  // LOAD SERVICE DATA
  // --------------------------------

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      setLoading(true);

      try {
        const [categoryResponse, packageResponse] =
          await Promise.all([
            api.get("/services/categories"),
            api.get("/services/packages"),
          ]);

        if (!mounted) return;

        const categoryData =
          categoryResponse.data?.data?.categories ||
          categoryResponse.data?.categories ||
          categoryResponse.data?.data ||
          categoryResponse.data;

        const packageData =
          packageResponse.data?.data?.packages ||
          packageResponse.data?.packages ||
          packageResponse.data?.data ||
          packageResponse.data;

        if (Array.isArray(categoryData)) {
          setCategories(
            categoryData.map(normalizeCategory)
          );
        }

        if (Array.isArray(packageData)) {
          setPackages(
            packageData.map(normalizePackage)
          );
        }
      } catch (error) {
        console.warn(
          "Service API unavailable. Using demonstration data.",
          error.message
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------
  // NORMALIZE API DATA
  // --------------------------------

  function normalizeCategory(item) {
    return {
      ...item,
      id: String(item.id || item._id),
      name: item.name || item.categoryName || "Unnamed Category",
      bayType: item.bayType || item.targetBayType || "General Service",
      description: item.description || "",
      icon: item.icon || "car-front",
      color: item.color || "blue",
      status: item.status || "Active",
    };
  }

  function normalizePackage(item) {
    const categoryId =
      typeof item.category === "object"
        ? String(item.category?._id || item.category?.id)
        : String(item.category || item.categoryId || "");

    const category = categories.find(
      (cat) => cat.id === categoryId
    );

    return {
      ...item,
      id: String(item.id || item._id),
      name: item.name || item.packageName || "",
      sku: item.sku || item.code || "",
      category: categoryId,
      categoryName:
        item.categoryName ||
        item.category?.name ||
        category?.name ||
        "",
      bayType: item.bayType || item.targetBayType || "",
      duration: Number(item.duration || item.estimatedDuration || 0),
      baseLaborCost: Number(item.baseLaborCost || 0),
      partsCost: Number(item.partsCost || 0),
      certification: item.certification || "",
      description: item.description || "",
      checkpoints: item.checkpoints || [],
      status: item.status || "Active",
    };
  }

  // --------------------------------
  // FILTER CATEGORIES
  // --------------------------------

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (activeCategory !== "all") {
      result = result.filter(
        (item) => item.id === activeCategory
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((category) => {
        const categoryPackages = packages.filter(
          (item) => item.category === category.id
        );

        return (
          category.name.toLowerCase().includes(query) ||
          category.id.toLowerCase().includes(query) ||
          categoryPackages.some(
            (pkg) =>
              pkg.name.toLowerCase().includes(query) ||
              pkg.sku.toLowerCase().includes(query)
          )
        );
      });
    }

    return result;
  }, [categories, packages, activeCategory, search]);

  // --------------------------------
  // FILTER PACKAGES
  // --------------------------------

  const filteredPackages = useMemo(() => {
    let result = [...packages];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
      );
    }

    return result;
  }, [packages, search]);

  // --------------------------------
  // OPEN PACKAGE MODAL
  // --------------------------------

  const openAddPackage = (category = null) => {
    setEditingPackage(null);
    setDefaultCategory(category);
    setShowPackageModal(true);
  };

  const openEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setDefaultCategory(null);
    setShowPackageModal(true);
  };

  // --------------------------------
  // SAVE PACKAGE
  // --------------------------------

  const handleSavePackage = async (form) => {
    const category = categories.find(
      (item) => item.id === form.category
    );

    if (!category) {
      throw new Error("Please select a valid service category.");
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      category: category.id,
      description: form.description,
      baseLaborCost: Number(form.baseLaborCost),
      partsCost: Number(form.partsCost),
      duration: Number(form.duration),
      bayType: form.bayType,
      certification: form.certification,
      checkpoints: form.checkpoints,
      status: form.status,
    };

    try {
      let saved;

      if (editingPackage) {
        const response = await api.patch(
          `/services/packages/${editingPackage.id}`,
          payload
        );

        saved =
          response.data?.data?.package ||
          response.data?.package ||
          response.data?.data ||
          response.data;
      } else {
        const response = await api.post(
          "/services/packages",
          payload
        );

        saved =
          response.data?.data?.package ||
          response.data?.package ||
          response.data?.data ||
          response.data;
      }

      const normalized = normalizePackage({
        ...payload,
        ...saved,
        category: category.id,
        categoryName: category.name,
      });

      if (editingPackage) {
        setPackages((previous) =>
          previous.map((item) =>
            item.id === editingPackage.id
              ? normalized
              : item
          )
        );

        notify("Service package updated successfully.");
      } else {
        setPackages((previous) => [
          normalized,
          ...previous,
        ]);

        notify("New service package created successfully.");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Unable to save package. Check the service API."
      );
    }
  };

  // --------------------------------
  // DUPLICATE PACKAGE
  // --------------------------------

  const duplicatePackage = async (pkg) => {
    const payload = {
      ...pkg,
      name: `${pkg.name} (Copy)`,
      sku: `COPY-${Date.now()}`,
      status: "Draft",
    };

    delete payload.id;
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      const response = await api.post(
        "/services/packages",
        payload
      );

      const saved =
        response.data?.data?.package ||
        response.data?.package ||
        response.data?.data ||
        response.data;

      setPackages((previous) => [
        normalizePackage({
          ...payload,
          ...saved,
        }),
        ...previous,
      ]);

      notify("Service package duplicated successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to duplicate service package.",
        "error"
      );
    }
  };

  // --------------------------------
  // SAVE CATEGORY
  // --------------------------------

  const handleSaveCategory = async (form) => {
    const payload = {
      name: form.name,
      description: form.description,
      bayType: form.bayType,
      icon: form.icon,
      color: form.color,
      status: form.status,
    };

    try {
      if (editingCategory) {
        const response = await api.patch(
          `/services/categories/${editingCategory.id}`,
          payload
        );

        const saved =
          response.data?.data?.category ||
          response.data?.category ||
          response.data?.data ||
          response.data;

        const normalized = normalizeCategory({
          ...payload,
          ...saved,
          id: editingCategory.id,
        });

        setCategories((previous) =>
          previous.map((item) =>
            item.id === editingCategory.id
              ? normalized
              : item
          )
        );

        notify("Service category updated successfully.");
      } else {
        const response = await api.post(
          "/services/categories",
          payload
        );

        const saved =
          response.data?.data?.category ||
          response.data?.category ||
          response.data?.data ||
          response.data;

        setCategories((previous) => [
          normalizeCategory({
            ...payload,
            ...saved,
          }),
          ...previous,
        ]);

        notify("Service category created successfully.");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Unable to save category. Check the service API."
      );
    }
  };

  // --------------------------------
  // CATEGORY ACTIONS
  // --------------------------------

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDuplicateCategory = async (category) => {
    const payload = {
      name: `${category.name} (Copy)`,
      description: category.description,
      bayType: category.bayType,
      icon: category.icon,
      color: category.color,
      status: "Active",
    };

    try {
      const response = await api.post(
        "/services/categories",
        payload
      );

      const saved =
        response.data?.data?.category ||
        response.data?.category ||
        response.data?.data ||
        response.data;

      setCategories((previous) => [
        normalizeCategory({
          ...payload,
          ...saved,
        }),
        ...previous,
      ]);

      notify("Category duplicated successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to duplicate category.",
        "error"
      );
    }
  };

  const toggleCategoryStatus = async (categoryId) => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (!category) return;

    const nextStatus =
      category.status === "Active" ? "Inactive" : "Active";

    try {
      await api.patch(
        `/services/categories/${categoryId}`,
        { status: nextStatus }
      );

      setCategories((previous) =>
        previous.map((item) =>
          item.id === categoryId
            ? { ...item, status: nextStatus }
            : item
        )
      );

      notify(`Category changed to ${nextStatus}.`);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to update category status.",
        "error"
      );
    }
  };

  // --------------------------------
  // EXPORT CATALOG
  // --------------------------------

  const exportCatalog = (format = "csv") => {
    const data = filteredPackages.map((pkg) => ({
      name: pkg.name,
      sku: pkg.sku,
      category: pkg.categoryName ||
        categories.find((c) => c.id === pkg.category)?.name,
      bayType: pkg.bayType,
      baseLaborCost: pkg.baseLaborCost,
      partsCost: pkg.partsCost,
      total: pkg.baseLaborCost + pkg.partsCost,
      duration: pkg.duration,
      certification: pkg.certification,
      status: pkg.status,
    }));

    let content;
    let mime;
    let extension;

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mime = "application/json";
      extension = "json";
    } else {
      const headers = Object.keys(data[0] || {
        name: "",
        sku: "",
        category: "",
        bayType: "",
        baseLaborCost: "",
        partsCost: "",
        total: "",
        duration: "",
        certification: "",
        status: "",
      });

      const escapeCSV = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

      content = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((key) => escapeCSV(row[key])).join(",")
        ),
      ].join("\n");

      mime = "text/csv;charset=utf-8;";
      extension = "csv";
    }

    const blob = new Blob(
      ["\uFEFF", content],
      { type: mime }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `autocare-service-catalog.${extension}`;
    link.click();

    URL.revokeObjectURL(url);

    notify("Service catalog exported successfully.");
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-5">

      {/* PAGE HEADING */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#10243b] sm:text-3xl">
            Service Categories &amp;
            <br className="hidden sm:block" /> Service Packages
          </h1>

          <p className="mt-2 max-w-lg text-xs leading-5 text-slate-600">
            Configure diagnostic routines, labor rates, estimated
            durations, bay allocations, and active client packages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportCatalog("csv")}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#172c43] hover:bg-slate-50"
          >
            <Download size={15} />
            Export Catalog (JSON/CSV)
          </button>

          <button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-[#10243b] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
          >
            <FolderPlus size={15} />
            Add Category
          </button>

          <button
            onClick={() => openAddPackage()}
            className="flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-orange-600"
          >
            <Plus size={16} />
            Add New Service
          </button>
        </div>
      </div>

      {/* CATEGORY SUMMARY */}
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 sm:w-fit">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />

        <span className="text-[10px] font-bold text-blue-800">
          {categories.filter((c) => c.status === "Active").length} Active Categories
        </span>

        <span className="text-blue-300">•</span>

        <span className="text-[10px] font-semibold text-blue-700">
          {packages.filter((p) => p.status === "Active").length} Standard Packages
        </span>
      </div>

      {/* STATISTICS */}
      <ServiceStats
        categories={categories}
        packages={packages}
      />

      {/* NOTIFICATION */}
      {notification && (
        <div
          role="status"
          className={`flex items-center justify-between rounded-lg border p-3 text-xs ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}

            {notification.message}
          </span>

          <button onClick={() => setNotification(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* SERVICE CATALOG */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* SEARCH BAR */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-extrabold text-[#10243b]">
            Service Catalog
          </h2>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories, service code..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-400"
            />
          </div>
        </div>

        {/* CATEGORY TABS */}
        <ServiceCategoryTabs
          categories={categories}
          packages={packages}
          activeCategory={activeCategory}
          setActiveCategory={(value) => {
            setActiveCategory(value);
            setPage(1);
          }}
        />

        {/* TABLE */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              <p className="mt-3 text-xs text-slate-500">
                Loading service catalog...
              </p>
            </div>
          </div>
        ) : (
          <ServicePackagesTable
            categories={filteredCategories}
            packages={filteredPackages}
            onEdit={(category) => openEditCategory(category)}
            onDuplicate={handleDuplicateCategory}
            onToggleStatus={toggleCategoryStatus}
            onAddPackage={openAddPackage}
            page={page}
            setPage={setPage}
          />
        )}
      </section>

      {/* ADD / EDIT PACKAGE MODAL */}
      <ServicePackageModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        categories={categories}
        editingPackage={editingPackage}
        defaultCategory={defaultCategory}
        onSave={handleSavePackage}
      />

      {/* ADD / EDIT CATEGORY MODAL */}
      <ServiceCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        editingCategory={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
