import { Clock3 } from "lucide-react";

import { PlatformLogo } from "@/components/compare/platform-logo";
import { Badge } from "@/components/ui/badge";
import { platformLabels } from "@/lib/constants";
import { PlatformPrice } from "@/types";

export function PriceRow({ price, cheapest, index = 0 }: { price: PlatformPrice; cheapest?: boolean; index?: number }) {
  const isOddPosition = index % 2 === 0;
  const bgClass = isOddPosition ? "bg-[#8C5A3C] border-[#8C5A3C] text-white" : "bg-[#F6E7BC] border-[#F6E7BC] text-[#4B2E2B]";

  return (
    <div
      className={`rounded-2xl border p-4 transition ${bgClass} ${
        cheapest ? "ring-2 ring-success-500/70 ring-offset-2 ring-offset-[#FFF8F0]" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlatformLogo platform={price.platform} size="sm" />
          <div className="text-sm font-semibold">{platformLabels[price.platform]}</div>
        </div>
        {cheapest ? <Badge variant="success">Cheapest</Badge> : null}
      </div>
      <div className="text-2xl font-bold">Rs {price.totalCost.toFixed(0)}</div>
      <div className={`mt-1 text-xs ${isOddPosition ? "text-white/75" : "text-[#4B2E2B]/75"}`}>Rs {price.price.toFixed(0)} item total + fees</div>
      <div className={`mt-3 flex items-center gap-2 text-xs ${isOddPosition ? "text-white/75" : "text-[#4B2E2B]/75"}`}>
        <Clock3 className="h-3.5 w-3.5" />
        {price.deliveryMins} mins | delivery Rs {price.deliveryFee}
      </div>
    </div>
  );
}
