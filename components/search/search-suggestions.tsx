"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { fallbackProductImage } from "@/lib/constants";
import { ProductWithPrices } from "@/types";

type SearchSuggestionsProps = {
  query: string;
  products: ProductWithPrices[];
  city: string;
  isOpen?: boolean;
  showViewAll?: boolean;
  onSelect?: (productName: string) => void;
};

export function SearchSuggestions({ query, products, city, isOpen = true, showViewAll = true, onSelect }: SearchSuggestionsProps) {
  if (!query || !isOpen) return null;

  return (
    <Card className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden border-white/70 bg-white/95 p-2 backdrop-blur-xl">
      {products.length > 0 ? (
        <div className="space-y-1">
          {products.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/dashboard/compare?q=${encodeURIComponent(product.name)}&city=${encodeURIComponent(city)}`}
              onClick={() => onSelect?.(product.name)}
              className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-surface-50"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-surface-100">
                <Image src={product.imageUrl ?? fallbackProductImage} alt={product.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-surface-900">{product.name}</div>
                <div className="truncate text-xs text-slate-500">{product.brand} | {product.category}</div>
              </div>
              <Badge variant="success">From Rs {product.lowestPrice}</Badge>
            </Link>
          ))}
          {showViewAll ? (
            <Link
              href={`/dashboard/compare?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`}
              className="flex items-center justify-between rounded-xl border border-surface-200 px-3 py-3 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
            >
              <span>View all results for &quot;{query}&quot;</span>
              <span>{products.length} matches</span>
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl bg-surface-50 p-6 text-center">
          <div className="mb-2 text-sm font-semibold text-surface-900">No products found for &quot;{query}&quot;</div>
          <div className="text-xs text-slate-500">Try broader terms like Amul Milk, Maggi, or Dove Shampoo.</div>
        </div>
      )}
    </Card>
  );
}
