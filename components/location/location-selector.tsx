"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterSupportedLocations } from "@/lib/locations";
import { useLocationStore } from "@/store/locationStore";
import { cn } from "@/lib/utils";

type LocationSelectorProps = {
  className?: string;
  buttonVariant?: "outline" | "secondary" | "ghost";
};

export function LocationSelector({ className, buttonVariant = "outline" }: LocationSelectorProps) {
  const { city, pincode, setLocation } = useLocationStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const locations = useMemo(() => filterSupportedLocations(query).slice(0, 8), [query]);

  return (
    <div className={cn("relative", className)}>
      <Button type="button" variant={buttonVariant} className="gap-2 rounded-pill px-4 py-2 text-sm" onClick={() => setOpen((value) => !value)}>
        <MapPin className="h-4 w-4" />
        {city}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-2xl border border-surface-200 bg-white p-3 shadow-elevated">
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-surface-200 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city or pincode"
              className="border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1">
            {locations.map((location) => {
              const active = location.city === city && location.pincode === pincode;

              return (
                <button
                  key={`${location.city}-${location.pincode}`}
                  type="button"
                  onClick={() => {
                    setLocation(location.city, location.pincode);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition",
                    active ? "bg-brand-50 text-brand-600" : "hover:bg-surface-50"
                  )}
                >
                  <div>
                    <div className="text-sm font-semibold">{location.city}</div>
                    <div className="text-xs text-slate-500">
                      {location.state} · {location.pincode}
                    </div>
                  </div>
                  {active ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}

            {!locations.length ? <div className="px-3 py-6 text-center text-sm text-slate-500">No matching locations found.</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
