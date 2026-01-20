"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PromptCard from "@/components/PromptCard";
import SearchBar from "@/components/SearchBar";
import PrimaryCategoryFilter from "@/components/PrimaryCategoryFilter";
import SecondaryFilters from "@/components/SecondaryFilters";
import FilteredResults from "@/components/FilteredResults";
import { getPromptsByCategory } from "@/lib/prompts";
import {
  createEmptyFilters,
  queryStringToFilters,
  filtersToQueryString,
  getActiveFilterCount,
} from "@/lib/filters";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(() => queryStringToFilters(searchParams));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const queryString = filtersToQueryString(filters);
    const newUrl = queryString ? `/?${queryString}` : "/";
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters = queryStringToFilters(searchParams);
    setFilters(urlFilters);
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      primaryCategory: categoryId,
      // Clear god filter if not "with-god"
      god: categoryId === "with-god" ? prev.god : null,
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);
  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim().length > 0;

  const trending = useMemo(() => getPromptsByCategory("trending"), []);
  const newPrompts = useMemo(() => getPromptsByCategory("new"), []);
  const archive = useMemo(() => getPromptsByCategory("archive"), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-gray-900">AItrendpromt</h1>
          <p className="mt-1 text-sm text-gray-600">Discover viral prompts with real examples</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search and Filter Bar */}
        <div className="mb-10">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Category Filter and Mobile Filter Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full">
              <PrimaryCategoryFilter
                activeCategory={filters.primaryCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div>
          {/* Main Content */}
          <div>
            {hasActiveFilters ? (
              <FilteredResults filters={filters} searchQuery={searchQuery} />
            ) : (
              <>
                <section className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Trending Today</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {trending.map((prompt) => (
                      <PromptCard key={prompt.slug} prompt={prompt} />
                    ))}
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">New Prompts</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {newPrompts.map((prompt) => (
                      <PromptCard key={prompt.slug} prompt={prompt} />
                    ))}
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Old Viral Trends</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {archive.map((prompt) => (
                      <PromptCard key={prompt.slug} prompt={prompt} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Secondary Filters */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div onClick={(e) => e.stopPropagation()}>
            <SecondaryFilters
              filters={filters}
              onFilterChange={(newFilters) => {
                handleFilterChange(newFilters);
              }}
              onClose={() => setShowMobileFilters(false)}
              isMobile={true}
            />
          </div>
        </>
      )}

      <footer className="border-t border-gray-200 bg-white py-10 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} AItrendpromt • Free, no login required</p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
