"use client";

import { PRIMARY_CATEGORIES } from "@/lib/filters";

export default function PrimaryCategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            !activeCategory
              ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-label="Show all categories"
        >
          All
        </button>
        {PRIMARY_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
              activeCategory === category.id
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label={`Filter by ${category.label}`}
            aria-pressed={activeCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

