
import { Layers3 } from "lucide-react";

export default function ServiceCategoryTabs({
  categories,
  packages,
  activeCategory,
  setActiveCategory,
}) {
  const getCount = (categoryId) =>
    packages.filter(
      (item) =>
        item.category === categoryId &&
        item.status === "Active"
    ).length;

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-3">
      <button
        onClick={() => setActiveCategory("all")}
        className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold transition ${
          activeCategory === "all"
            ? "bg-[#10243b] text-white"
            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Layers3 size={13} />
        All Categories ({packages.filter((p) => p.status === "Active").length})
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-medium transition ${
            activeCategory === category.id
              ? "border-orange-300 bg-orange-50 text-orange-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {category.name} ({getCount(category.id)})
        </button>
      ))}
    </div>
  );
}
