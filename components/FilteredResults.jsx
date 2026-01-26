"use client";

import { useMemo, useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import CopyButton from "./CopyButton";
import { getActiveFilterCount, generatePromptFromFilters } from "@/lib/filters";
import { getAllPrompts } from "@/lib/api";

export default function FilteredResults({ filters, searchQuery }) {
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilteredPrompts() {
      setLoading(true);
      try {
        const apiFilters = {
          search: searchQuery?.trim() || undefined,
          primaryCategory: filters.primaryCategory || undefined,
          style: filters.style?.length > 0 ? filters.style : undefined,
          pose: filters.pose?.length > 0 ? filters.pose : undefined,
          background: filters.background?.length > 0 ? filters.background : undefined,
          god: filters.god || undefined,
        };
        
        // Remove undefined values
        Object.keys(apiFilters).forEach(key => 
          apiFilters[key] === undefined && delete apiFilters[key]
        );
        
        const results = await getAllPrompts(apiFilters);
        
        // Sort by trendRank (descending), then by createdAt (descending) as fallback
        const sortedResults = [...results].sort((a, b) => {
          const rankA = a.trendRank || 0;
          const rankB = b.trendRank || 0;
          if (rankA !== rankB) {
            return rankB - rankA; // Higher rank first
          }
          // If same rank, sort by createdAt (newer first)
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
        
        setFilteredPrompts(sortedResults);
      } catch (error) {
        console.error("Error fetching filtered prompts:", error);
        setFilteredPrompts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFilteredPrompts();
  }, [filters, searchQuery]);

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);
  const generatedPrompt = useMemo(() => generatePromptFromFilters(filters), [filters]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.slug || prompt._id} prompt={prompt} />
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

