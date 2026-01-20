"use client";

import { useState } from "react";
import {
  STYLE_FILTERS,
  POSE_FILTERS,
  BACKGROUND_FILTERS,
  GOD_FILTERS,
} from "@/lib/filters";

export default function SecondaryFilters({
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  const showGodFilter = filters.primaryCategory === "with-god";
  const hideWeddingCouple = filters.primaryCategory === "baby";

  // Filter out wedding/couple from pose filters if baby is selected
  const availablePoseFilters = hideWeddingCouple
    ? POSE_FILTERS.filter((p) => p.id !== "wedding" && p.id !== "couple")
    : POSE_FILTERS;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleArrayFilter = (filterType, value) => {
    const current = filters[filterType] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [filterType]: updated });
  };

  const toggleGodFilter = (godId) => {
    onFilterChange({
      ...filters,
      god: filters.god === godId ? null : godId,
    });
  };

  const FilterGroup = ({ title, items, selectedItems, onToggle, isSingle = false }) => {
    const isExpanded = expandedSection === title;
    const hasSelection = isSingle
      ? selectedItems !== null
      : selectedItems.length > 0;

    if (isMobile) {
      return (
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection(title)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={isExpanded}
          >
            <span className="font-semibold text-gray-900">{title}</span>
            <div className="flex items-center gap-2">
              {hasSelection && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {isSingle ? "1" : selectedItems.length}
                </span>
              )}
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          {isExpanded && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                  const isSelected = isSingle
                    ? selectedItems === item.id
                    : selectedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onToggle(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Desktop view
    return (
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-600 mb-2.5 flex items-center gap-2 uppercase tracking-wide">
          {title}
          {hasSelection && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
              {isSingle ? "1" : selectedItems.length}
            </span>
          )}
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const isSelected = isSingle
              ? selectedItems === item.id
              : selectedItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:from-blue-700 hover:to-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={isSelected}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto z-50 animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <div className="flex items-center gap-3">
              {(filters.style.length > 0 || filters.pose.length > 0 || filters.background.length > 0 || filters.god) && (
                <button
                  onClick={() => onFilterChange({ ...filters, style: [], pose: [], background: [], god: null })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 pb-8">
          <FilterGroup
            title="Style"
            items={STYLE_FILTERS}
            selectedItems={filters.style}
            onToggle={(id) => toggleArrayFilter("style", id)}
          />
          <FilterGroup
            title="Pose / Scene"
            items={availablePoseFilters}
            selectedItems={filters.pose}
            onToggle={(id) => toggleArrayFilter("pose", id)}
          />
          <FilterGroup
            title="Background"
            items={BACKGROUND_FILTERS}
            selectedItems={filters.background}
            onToggle={(id) => toggleArrayFilter("background", id)}
          />
          {showGodFilter && (
            <FilterGroup
              title="God"
              items={GOD_FILTERS}
              selectedItems={filters.god}
              onToggle={toggleGodFilter}
              isSingle={true}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">Refine Results</h2>
        {(filters.style.length > 0 || filters.pose.length > 0 || filters.background.length > 0 || filters.god) && (
          <button
            onClick={() => onFilterChange({ ...filters, style: [], pose: [], background: [], god: null })}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Clear
          </button>
        )}
      </div>
      <FilterGroup
        title="Style"
        items={STYLE_FILTERS}
        selectedItems={filters.style}
        onToggle={(id) => toggleArrayFilter("style", id)}
      />
      <FilterGroup
        title="Pose / Scene"
        items={availablePoseFilters}
        selectedItems={filters.pose}
        onToggle={(id) => toggleArrayFilter("pose", id)}
      />
      <FilterGroup
        title="Background"
        items={BACKGROUND_FILTERS}
        selectedItems={filters.background}
        onToggle={(id) => toggleArrayFilter("background", id)}
      />
      {showGodFilter && (
        <FilterGroup
          title="God"
          items={GOD_FILTERS}
          selectedItems={filters.god}
          onToggle={toggleGodFilter}
          isSingle={true}
        />
      )}
    </div>
  );
}

