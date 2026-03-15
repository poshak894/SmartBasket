"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import { HiddenFeeBreakdown } from "@/components/compare/hidden-fee-breakdown";
import { PlatformLogo } from "@/components/compare/platform-logo";
import { PriceRow } from "@/components/compare/price-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimePrices } from "@/hooks/useRealtimePrices";
import { fallbackProductImage, getProductImage } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import { ProductWithPrices } from "@/types";

export function ProductCard({ product, index = 0 }: { product: ProductWithPrices; index?: number }) {
  const addItem = useCartStore((state) => state.addItem);
  const searchParams = useSearchParams();
  const { prices, liveSource } = useRealtimePrices(product.id, product.prices, product.prices[0]?.pincode ?? "560001");
  const productImage = getProductImage(product.id, product.imageUrl);
  const [imageSrc, setImageSrc] = useState(productImage);
  const showHiddenFees = searchParams.get("fees") !== "off";
  const activeSort = searchParams.get("sort") ?? "Best value";
  const inStockOnly = searchParams.get("inStock") === "true";
  const maxWaitMins = Number(searchParams.get("maxWaitMins") ?? "0");

  const visiblePrices = useMemo(() => {
    return prices.filter((price) => {
      if (inStockOnly && !price.inStock) {
        return false;
      }
      if (maxWaitMins > 0 && price.deliveryMins > maxWaitMins) {
        return false;
      }
      return true;
    });
  }, [inStockOnly, maxWaitMins, prices]);

  const cheapestPrice = useMemo(() => {
    return [...visiblePrices].sort((a, b) => a.totalCost - b.totalCost)[0] ?? visiblePrices[0];
  }, [visiblePrices]);

  const sortedVisiblePrices = useMemo(() => {
    const next = [...visiblePrices];

    switch (activeSort) {
      case "Lowest price":
        return next.sort((a, b) => a.totalCost - b.totalCost);
      case "Fastest delivery":
        return next.sort((a, b) => a.deliveryMins - b.deliveryMins || a.totalCost - b.totalCost);
      case "Most savings":
        return next.sort((a, b) => (b.mrp - b.totalCost) - (a.mrp - a.totalCost));
      case "Best value":
      default:
        return next.sort((a, b) => {
          const aScore = (a.mrp - a.totalCost) - a.deliveryMins * 0.35;
          const bScore = (b.mrp - b.totalCost) - b.deliveryMins * 0.35;
          return bScore - aScore;
        });
    }
  }, [activeSort, visiblePrices]);

  useEffect(() => {
    setImageSrc(productImage);
  }, [productImage]);

  if (!visiblePrices.length || !cheapestPrice) {
    return null;
  }

  return (
    <motion.article
      custom={index}
      initial={false}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
      whileHover={{ y: -3 }}
      className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-card backdrop-blur-xl"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl bg-surface-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain"
            onError={() => {
              if (imageSrc !== fallbackProductImage) {
                setImageSrc(fallbackProductImage);
              }
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-surface-900">{product.name}</h3>
            <Badge>{product.category}</Badge>
          </div>
          <div className="mt-1 text-sm text-slate-500">{product.brand} | MRP Rs {prices[0]?.mrp}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="warning">Save up to Rs {product.savingsPotential}</Badge>
            <Badge variant="success">Live across {visiblePrices.length} platforms</Badge>
            <Badge variant="outline">{liveSource === "supabase" ? "Realtime via Supabase" : liveSource === "sse" ? "Live stream fallback" : "Static snapshot"}</Badge>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {sortedVisiblePrices.slice(0, 8).map((price) => (
              <PlatformLogo key={price.id} platform={price.platform} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {sortedVisiblePrices.slice(0, 8).map((price, priceIndex) => (
          <PriceRow key={price.id} price={price} cheapest={price.id === cheapestPrice.id} index={priceIndex} />
        ))}
      </div>

      {showHiddenFees ? (
        <div className="mt-5">
          <HiddenFeeBreakdown price={cheapestPrice} />
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-surface-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="success">You save Rs {product.savingsPotential}</Badge>
        <Button onClick={() => addItem(product)} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Smart Cart
        </Button>
      </div>
    </motion.article>
  );
}
