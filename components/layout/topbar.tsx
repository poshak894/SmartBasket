"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, SlidersHorizontal } from "lucide-react";

import { LocationSelector } from "@/components/location/location-selector";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showHiddenFees = searchParams.get("fees") !== "off";

  function toggleHiddenFees() {
    const params = new URLSearchParams(searchParams.toString());

    if (showHiddenFees) {
      params.set("fees", "off");
    } else {
      params.delete("fees");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="sticky top-0 z-30 border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex-1">
          <Suspense fallback={<div className="h-[52px] rounded-2xl border border-surface-200 bg-white shadow-card" />}>
            <SearchBar />
          </Suspense>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LocationSelector />
          <button type="button" onClick={toggleHiddenFees} className="rounded-pill">
            <Badge variant={showHiddenFees ? "default" : "outline"} className="gap-2 rounded-pill px-4 py-2 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Hidden fees {showHiddenFees ? "on" : "off"}
            </Badge>
          </button>
          <Button variant="secondary" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
