"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Instagram } from "lucide-react";
import PromptCard from "@/components/PromptCard";
import SearchBar from "@/components/SearchBar";
import PrimaryCategoryFilter from "@/components/PrimaryCategoryFilter";
import SecondaryFilters from "@/components/SecondaryFilters";
import FilteredResults from "@/components/FilteredResults";
import { getAllPrompts } from "@/lib/api";
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
  const [trending, setTrending] = useState([]);
  const [newPrompts, setNewPrompts] = useState([]);
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch prompts on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [trendingData, newData, archiveData] = await Promise.all([
          getAllPrompts({ category: "trending" }),
          getAllPrompts({ category: "new" }),
          getAllPrompts({ category: "archive" })
        ]);
        setTrending(trendingData);
        setNewPrompts(newData);
        setArchive(archiveData);
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      god: categoryId === "with-god" ? prev.god : null,
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);
  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AItrendpromt</h1>
              <p className="mt-0.5 text-xs text-gray-600">Discover viral AI prompts with real examples</p>
            </div>
            <a
              href="https://www.instagram.com/aitrendpromt/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Follow on Instagram</span>
              <span className="sm:hidden">Follow</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Search and Filter Bar */}
        <div className="mb-5">
          <div className="mb-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex-1 w-full">
              <PrimaryCategoryFilter
                activeCategory={filters.primaryCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
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

        {/* Instagram CTA - Prominent Position */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-gray-900">Get Daily Trending Prompts on Instagram</h3>
                <p className="text-xs text-gray-700">See real examples & step-by-step tutorials</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/aitrendpromt/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @aitrendpromt</span>
            </a>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading prompts...</p>
            </div>
          ) : hasActiveFilters ? (
            <FilteredResults filters={filters} searchQuery={searchQuery} />
          ) : (
            <>
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">🔥 Trending Today</h2>
                {trending.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    {trending.map((prompt) => (
                      <PromptCard key={prompt.slug || prompt._id} prompt={prompt} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm">No trending prompts yet.</p>
                )}
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">✨ New Prompts</h2>
                {newPrompts.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    {newPrompts.map((prompt) => (
                      <PromptCard key={prompt.slug || prompt._id} prompt={prompt} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm">No new prompts yet.</p>
                )}
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">📦 Old Viral Trends</h2>
                {archive.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    {archive.map((prompt) => (
                      <PromptCard key={prompt.slug || prompt._id} prompt={prompt} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm">No archived prompts yet.</p>
                )}
              </section>
            </>
          )}
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

      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-xs">
          <p>© {new Date().getFullYear()} AItrendpromt • Free, no login required</p>
          <a
            href="https://www.instagram.com/aitrendpromt/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Follow us on Instagram for best results</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
