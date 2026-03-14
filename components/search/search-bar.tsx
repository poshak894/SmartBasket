"use client";

import { Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SearchSuggestions } from "@/components/search/search-suggestions";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { useLocationStore } from "@/store/locationStore";
import { ProductWithPrices } from "@/types";

function useDebouncedValue<T>(value: T, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { city } = useLocationStore();
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim());
  const { data, isFetching } = useSearch(debouncedQuery, city);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? defaultValue);
  }, [searchParams, defaultValue]);

  const products = useMemo<ProductWithPrices[]>(() => data?.products ?? [], [data]);

  function navigateToResults(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) return;

    const params = new URLSearchParams({ q: trimmedQuery, city });
    router.push(`/dashboard/compare?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigateToResults(query);
        }}
        className="group flex h-[52px] items-center rounded-2xl border border-surface-200 bg-white px-4 shadow-card transition focus-within:border-brand-100 focus-within:shadow-elevated"
      >
        <div className="mr-3 text-slate-400">{isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}</div>
        <input
          aria-label="Search quick commerce products"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Amul Butter, Maggi, atta, shampoo..."
          className="flex-1 bg-transparent text-sm text-surface-900 outline-none placeholder:text-slate-400"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
            className="mr-2 rounded-full p-1 text-slate-400 transition hover:bg-surface-100"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <Button type="button" variant="secondary" className="hidden gap-2 md:inline-flex">
          <MapPin className="h-4 w-4" />
          {city}
        </Button>
        <Button type="submit" className="ml-2 hidden lg:inline-flex">
          Search
        </Button>
      </form>

      <SearchSuggestions
        isOpen={isOpen && debouncedQuery.length > 1}
        query={debouncedQuery}
        products={products}
        city={city}
        onSelect={(productName) => {
          setQuery(productName);
          navigateToResults(productName);
        }}
        showViewAll={pathname !== "/dashboard/compare"}
      />
    </div>
  );
}
