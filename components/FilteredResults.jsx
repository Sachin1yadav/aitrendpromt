"use client";

import { useMemo } from "react";
import PromptCard from "./PromptCard";
import CopyButton from "./CopyButton";
import { matchesFilters, getActiveFilterCount, generatePromptFromFilters } from "@/lib/filters";
import { getAllPrompts } from "@/lib/prompts";

export default function FilteredResults({ filters, searchQuery }) {
  const allPrompts = useMemo(() => getAllPrompts(), []);

  const filteredPrompts = useMemo(() => {
    let results = allPrompts;

    // Apply search first if exists
    if (searchQuery?.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply filters
    const hasActiveFilters = getActiveFilterCount(filters) > 0;
    if (hasActiveFilters) {
      results = results.filter((prompt) => matchesFilters(prompt, filters));
    }

    return results;
  }, [allPrompts, filters, searchQuery]);

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);
  const generatedPrompt = useMemo(() => generatePromptFromFilters(filters), [filters]);

  return (
    <div>
      {/* Results Grid */}

      {/* Results Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-2">No prompts found matching your filters.</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

