"use client";

import { Suspense } from "react";
import { Bell, MapPin, SlidersHorizontal } from "lucide-react";

import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocationStore } from "@/store/locationStore";

export function TopBar() {
  const { city } = useLocationStore();

  return (
    <div className="sticky top-0 z-30 border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex-1">
          <Suspense fallback={<div className="h-[52px] rounded-2xl border border-surface-200 bg-white shadow-card" />}>
            <SearchBar />
          </Suspense>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="gap-2 rounded-pill px-4 py-2 text-sm">
            <MapPin className="h-4 w-4" />
            {city}
          </Badge>
          <Badge variant="outline" className="gap-2 rounded-pill px-4 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4" />
            Hidden fees on
          </Badge>
          <Button variant="secondary" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
