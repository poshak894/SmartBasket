"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { RealtimePostgresChangesPayload } from "@supabase/realtime-js";

import { HiddenFeeBreakdown } from "@/components/compare/hidden-fee-breakdown";
import { PlatformLogo } from "@/components/compare/platform-logo";
import { PriceRow } from "@/components/compare/price-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { amulBrandLogo, fallbackProductImage } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { PlatformPrice, ProductWithPrices } from "@/types";

export function ProductCard({ product, index = 0 }: { product: ProductWithPrices; index?: number }) {
  const addItem = useCartStore((state) => state.addItem);
  const [prices, setPrices] = useState(product.prices);
  const supabase = useMemo(() => createClient(), []);
  const productImage = product.id === "amul-butter" ? amulBrandLogo : product.imageUrl ?? fallbackProductImage;

  const cheapestPrice = useMemo(() => {
    return [...prices].sort((a, b) => a.totalCost - b.totalCost)[0] ?? prices[0];
  }, [prices]);

  useEffect(() => {
    setPrices(product.prices);
  }, [product.prices]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`platform-price:${product.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "PlatformPrice", filter: `productId=eq.${product.id}` },
        (payload: RealtimePostgresChangesPayload<PlatformPrice>) => {
          const updated = payload.new as unknown as Partial<PlatformPrice> & { id: string; productId: string };
          if (!updated?.id) return;

          setPrices((current) => {
            const exists = current.some((price) => price.id === updated.id);
            if (exists) {
              return current.map((price) => (price.id === updated.id ? { ...price, ...updated } : price));
            }

            if (updated.productId === product.id) {
              return [...current, updated as PlatformPrice];
            }

            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id, supabase]);

  return (
    <motion.article
      custom={index}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
      whileHover={{ y: -3 }}
      className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-card backdrop-blur-xl"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl bg-surface-100">
          <Image src={productImage} alt={product.name} fill className="object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-surface-900">{product.name}</h3>
            <Badge>{product.category}</Badge>
          </div>
          <div className="mt-1 text-sm text-slate-500">{product.brand} | MRP Rs {prices[0]?.mrp}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="warning">Save up to Rs {product.savingsPotential}</Badge>
            <Badge variant="success">Live across 8 platforms</Badge>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {prices.slice(0, 8).map((price) => (
              <PlatformLogo key={price.id} platform={price.platform} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {prices.slice(0, 8).map((price, priceIndex) => (
          <PriceRow key={price.id} price={price} cheapest={price.id === cheapestPrice.id} index={priceIndex} />
        ))}
      </div>

      <div className="mt-5">
        <HiddenFeeBreakdown price={cheapestPrice} />
      </div>

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
