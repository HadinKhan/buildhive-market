import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { Icons } from "../components/Icons";
import { ContractorCard } from "../components/ContractorCard";
import { useAuth } from "../src/context/AuthContext";
import contractorService from "../src/services/contractorService";
import type { ContractorSummary } from "../types";

const categories = [
  "All",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Mason",
  "Painter",
  "Civil Engineer",
  "Interior Designer",
  "Other",
];

const minRatings = [1, 2, 3, 4, 5];

const pageSize = 9;

const normalizeText = (value?: string | null): string => (value || "").trim().toLowerCase();

const cityOnly = (value?: string | null): string => {
  const text = (value || "").trim();
  if (!text) {
    return "";
  }

  return text.split(",")[0].trim();
};

const ContractorSkeleton = () => (
  <div className="overflow-hidden rounded-[24px] border border-white/8 bg-white/4 shadow-[0_20px_45px_rgba(0,0,0,0.16)]">
    <div className="animate-pulse bg-slate-800/80 px-5 py-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-slate-700" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-slate-700" />
          <div className="h-3 w-1/2 rounded bg-slate-700" />
          <div className="h-3 w-28 rounded bg-slate-700" />
        </div>
      </div>
    </div>
    <div className="space-y-4 px-5 py-5">
      <div className="h-4 w-full rounded bg-slate-700" />
      <div className="h-4 w-5/6 rounded bg-slate-700" />
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/6 bg-white/4 p-4">
        <div className="h-10 rounded bg-slate-700" />
        <div className="h-10 rounded bg-slate-700" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="h-10 rounded-[16px] bg-slate-700" />
        <div className="h-10 rounded-[16px] bg-slate-700" />
      </div>
    </div>
  </div>
);

const fallbackIfEmpty = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

export const ContractorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [contractors, setContractors] = useState<ContractorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    minRating: 0,
    availability: "All",
  });

  useEffect(() => {
    let cancelled = false;

    const loadContractors = async () => {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await contractorService.getContractors({
          category: filters.category === "All" ? undefined : filters.category,
          minRating: filters.minRating || undefined,
          page,
          limit: pageSize,
          featured: false,
        });

        const nextItems = response.contractors
          .filter((contractor) => {
            const matchesCategory =
              filters.category === "All" ||
              normalizeText(contractor.trade).includes(normalizeText(filters.category)) ||
              normalizeText(contractor.category).includes(normalizeText(filters.category));
            const matchesRating = !filters.minRating || contractor.rating >= filters.minRating;
            const matchesAvailability =
              filters.availability === "All" || contractor.availableNow || contractor.availableNow === undefined;

            return matchesCategory && matchesRating && matchesAvailability;
          })
          .map((contractor) => ({
            ...contractor,
            location: cityOnly(contractor.location || contractor.city),
            bio: fallbackIfEmpty(contractor.bio || "") || "Verified contractor available for construction work.",
          }));

        if (cancelled) {
          return;
        }

        setContractors((current) => (page === 1 ? nextItems : [...current, ...nextItems]));
        setHasMore(nextItems.length >= pageSize);
      } catch (error) {
        console.error("Failed to load contractors:", error);
        if (!cancelled && page === 1) {
          setContractors([]);
          setHasMore(false);
        }
        if (!cancelled) {
          toast.error("Unable to load contractors right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    };

    loadContractors();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const displayedContractors = useMemo(() => contractors, [contractors]);

  const handleViewProfile = (contractor: ContractorSummary) => {
    navigate(`/contractors/${contractor.businessId || contractor.id}`);
  };

  const handleMessage = (contractor: ContractorSummary) => {
    const participantId = contractor.userId || contractor.businessId || contractor.id;
    if (!isAuthenticated) {
      navigate(`/signin?returnUrl=${encodeURIComponent(`/contractors/${contractor.businessId || contractor.id}`)}`);
      return;
    }

    navigate(`/account?tab=messages&participantId=${encodeURIComponent(participantId)}`);
  };

  const updateFilter = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const loadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setPage((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-[#0b0f12] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[28px] border border-white/8 bg-gradient-to-br from-[#0f172a] via-[#141226] to-[#1a1327] px-6 py-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                Contractors
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Find a Contractor</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Hire verified construction professionals across every trade.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none justify-center min-h-[44px]" onClick={() => navigate("/services")}>
                Browse Services
              </Button>
              <Button variant="primary" className="flex-1 sm:flex-none justify-center min-h-[44px]" onClick={() => navigate("/products")}>
                Browse Materials
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <Button variant="outline" className="w-full justify-center" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
            <Icons.Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`${isMobileFiltersOpen ? "block" : "hidden"} rounded-[24px] border border-white/8 bg-white/4 p-5 lg:block lg:sticky lg:top-24 lg:h-fit`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Filters</h2>
              <button
                type="button"
                className="text-sm font-semibold text-violet-200 lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => updateFilter("category", category)}
                      className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors ${
                        filters.category === category
                          ? "border-violet-300/40 bg-violet-300/10 text-violet-100"
                          : "border-white/8 bg-white/5 text-slate-300 hover:border-violet-300/25 hover:text-white"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Minimum rating</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {minRatings.map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => updateFilter("minRating", rating)}
                      className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                        filters.minRating === rating
                          ? "border-amber-300/40 bg-amber-300/10 text-amber-100"
                          : "border-white/8 bg-white/5 text-slate-300 hover:border-amber-300/25 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1 text-amber-300">
                        {Array.from({ length: rating }).map((_, index) => (
                          <Icons.Star key={`${rating}-${index}`} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                      <span className="mt-1 block">{rating}+ stars</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Availability</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "All" },
                    { label: "Available Now", value: "Available Now" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateFilter("availability", option.value)}
                      className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors ${
                        filters.availability === option.value
                          ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
                          : "border-white/8 bg-white/5 text-slate-300 hover:border-emerald-300/25 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                {displayedContractors.length > 0
                  ? `${displayedContractors.length} contractor${displayedContractors.length === 1 ? "" : "s"} shown`
                  : "No contractors loaded yet"}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                <span className="rounded-full border border-white/8 bg-white/5 px-3 py-2">Page {page}</span>
                <span className="rounded-full border border-white/8 bg-white/5 px-3 py-2">PKR marketplace</span>
              </div>
            </div>

            {isLoading && page === 1 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ContractorSkeleton key={index} />
                ))}
              </div>
            ) : displayedContractors.length === 0 ? (
              <div className="rounded-[24px] border border-white/8 bg-white/4 px-6 py-16 text-center">
                <h2 className="text-2xl font-black text-white">No contractors found for your filters. Try adjusting your search.</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  Broaden the category, lower the rating threshold, or switch availability to All to discover more professionals.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {displayedContractors.map((contractor) => (
                    <ContractorCard
                      key={contractor.businessId || contractor.id}
                      contractor={contractor}
                      onViewProfile={handleViewProfile}
                      onMessage={handleMessage}
                    />
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[220px]"
                    onClick={loadMore}
                    disabled={!hasMore || isLoadingMore}
                  >
                    {isLoadingMore ? "Loading more..." : hasMore ? "Load More" : "No More Contractors"}
                  </Button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContractorsPage;
