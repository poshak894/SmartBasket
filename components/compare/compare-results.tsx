"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ProductCard } from "@/components/compare/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductWithPrices } from "@/types";

const sortOptions = ["Best value", "Lowest price", "Fastest delivery", "Most savings"] as const;

function getCheapestPrice(product: ProductWithPrices) {
  return [...product.prices].sort((a, b) => a.totalCost - b.totalCost)[0];
}

function sortProducts(products: ProductWithPrices[], sort: string) {
  const next = [...products];

  switch (sort) {
    case "Lowest price":
      return next.sort((a, b) => (getCheapestPrice(a)?.totalCost ?? Infinity) - (getCheapestPrice(b)?.totalCost ?? Infinity));
    case "Fastest delivery":
      return next.sort((a, b) => (getCheapestPrice(a)?.deliveryMins ?? Infinity) - (getCheapestPrice(b)?.deliveryMins ?? Infinity));
    case "Most savings":
      return next.sort((a, b) => b.savingsPotential - a.savingsPotential);
    case "Best value":
    default:
      return next.sort((a, b) => {
        const aPrice = getCheapestPrice(a);
        const bPrice = getCheapestPrice(b);
        const aScore = a.savingsPotential - (aPrice?.deliveryMins ?? 0) * 0.35;
        const bScore = b.savingsPotential - (bPrice?.deliveryMins ?? 0) * 0.35;
        return bScore - aScore;
      });
  }
}

export function CompareResults({
  products,
  query,
  emptyState
}: {
  products: ProductWithPrices[];
  query: string;
  emptyState: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(true);

  const activeSort = searchParams.get("sort") ?? "Best value";
  const inStockOnly = searchParams.get("inStock") === "true";
  const maxWaitMins = Number(searchParams.get("maxWaitMins") ?? "0");

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  }

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      const matchingPrices = product.prices.filter((price) => {
        if (inStockOnly && !price.inStock) {
          return false;
        }
        if (maxWaitMins > 0 && price.deliveryMins > maxWaitMins) {
          return false;
        }
        return true;
      });

      return matchingPrices.length > 0;
    });

    return sortProducts(next, activeSort);
  }, [activeSort, inStockOnly, maxWaitMins, products]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {sortOptions.map((option) => (
            <Button
              key={option}
              onClick={() => updateParams({ sort: option === "Best value" ? null : option })}
              variant="outline"
              className={cn(
                "rounded-pill border-surface-200 bg-white px-6 py-2.5 text-base text-brand-dark hover:border-brand-primary hover:bg-brand-light",
                activeSort === option && "border-brand-primary bg-brand-light text-brand-dark shadow-sm"
              )}
              aria-pressed={activeSort === option}
            >
              {option}
            </Button>
          ))}
          <Button
            variant="secondary"
            onClick={() => setFiltersOpen((value) => !value)}
            className="rounded-pill px-6 py-2.5 text-base"
          >
            {filtersOpen ? "Hide filters" : "Show filters"}
          </Button>
        </div>

        {filtersOpen ? (
          <div className="rounded-2xl border border-surface-200 bg-white/80 p-4 shadow-card">
            <div className="mb-3 text-sm font-semibold text-surface-900">Filter results</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => updateParams({ inStock: inStockOnly ? null : "true" })}
                className={cn(
                  "rounded-pill border-surface-200 bg-white px-5 py-2.5 text-base text-brand-dark hover:border-brand-primary hover:bg-brand-light",
                  inStockOnly && "border-success-500 bg-success-50 text-success-500"
                )}
                aria-pressed={inStockOnly}
              >
                In stock only
              </Button>
              {[15, 20, 30].map((mins) => (
                <Button
                  key={mins}
                  onClick={() => updateParams({ maxWaitMins: maxWaitMins === mins ? null : String(mins) })}
                  variant="outline"
                  className={cn(
                    "rounded-pill border-surface-200 bg-white px-5 py-2.5 text-base text-brand-dark hover:border-brand-primary hover:bg-brand-light",
                    maxWaitMins === mins && "border-warning-500 bg-warning-50 text-warning-500"
                  )}
                  aria-pressed={maxWaitMins === mins}
                >
                  Under {mins} min
                </Button>
              ))}
              {(inStockOnly || maxWaitMins > 0 || activeSort !== "Best value") ? (
                <Button
                  variant="ghost"
                  onClick={() => updateParams({ sort: null, platforms: null, inStock: null, maxWaitMins: null, fees: null })}
                >
                  Reset filters
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {filteredProducts.length ? (
        <div className="space-y-5">
          {filteredProducts.map((product, index) => (
            <ProductCard key={`${product.id}-${query || "featured"}`} product={product} index={index} />
          ))}
        </div>
      ) : (
        emptyState
      )}
    </div>
  );
}
