"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { PlatformPrice } from "@/types";

type StreamPayload = {
  platforms?: PlatformPrice[];
  updatedAt?: string;
};

function sortPrices(prices: PlatformPrice[]) {
  return [...prices].sort((a, b) => a.totalCost - b.totalCost);
}

export function useRealtimePrices(productId: string, initialPrices: PlatformPrice[], pincode: string) {
  const [prices, setPrices] = useState(() => sortPrices(initialPrices));
  const [liveSource, setLiveSource] = useState<"supabase" | "sse" | "initial">("initial");
  const fallbackStarted = useRef(false);
  const receivedSupabaseEvent = useRef(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setPrices(sortPrices(initialPrices));
  }, [initialPrices]);

  useEffect(() => {
    if (!productId) return;

    let channel: RealtimeChannel | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let eventSource: EventSource | null = null;
    let unsubscribed = false;

    receivedSupabaseEvent.current = false;

    const applyUpsert = (incoming: PlatformPrice) => {
      setPrices((current) => {
        const exists = current.some((price) => price.id === incoming.id);
        const next = exists ? current.map((price) => (price.id === incoming.id ? { ...price, ...incoming } : price)) : [...current, incoming];
        return sortPrices(next);
      });
    };

    const startSseFallback = () => {
      if (fallbackStarted.current || unsubscribed) return;

      fallbackStarted.current = true;
      setLiveSource("sse");
      eventSource = new EventSource(`/api/prices/stream?productId=${encodeURIComponent(productId)}&pincode=${encodeURIComponent(pincode)}`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as StreamPayload;
          if (payload.platforms?.length) {
            setPrices(sortPrices(payload.platforms));
          }
        } catch {
          // Ignore malformed stream packets and keep the last known prices.
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
      };
    };

    if (!supabase) {
      startSseFallback();
      return () => {
        unsubscribed = true;
        eventSource?.close();
      };
    }

    fallbackTimer = setTimeout(startSseFallback, 2500);

    channel = supabase
      .channel(`platform-price:${productId}:${pincode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "PlatformPrice", filter: `productId=eq.${productId}` },
        (payload: RealtimePostgresChangesPayload<PlatformPrice>) => {
          const incoming = payload.new as PlatformPrice;
          if (!incoming?.id || incoming.pincode !== pincode) return;
          receivedSupabaseEvent.current = true;
          setLiveSource("supabase");
          if (fallbackTimer) clearTimeout(fallbackTimer);
          eventSource?.close();
          applyUpsert({ ...incoming, fetchedAt: String(incoming.fetchedAt) });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setLiveSource("initial");
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          startSseFallback();
        }
      });

    return () => {
      unsubscribed = true;
      fallbackStarted.current = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      eventSource?.close();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [pincode, productId, supabase]);

  return { prices, liveSource };
}
