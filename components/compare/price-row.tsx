import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { platformLabels } from "@/lib/constants";
import { PlatformPrice } from "@/types";

export function PriceRow({ price, cheapest }: { price: PlatformPrice; cheapest?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 transition ${cheapest ? "border-success-500 bg-success-50" : "border-surface-200 bg-surface-50"}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-surface-900">{platformLabels[price.platform]}</div>
        {cheapest ? <Badge variant="success">Cheapest</Badge> : null}
      </div>
      <div className="text-2xl font-bold text-surface-900">Rs {price.totalCost.toFixed(0)}</div>
      <div className="mt-1 text-xs text-slate-500">Rs {price.price.toFixed(0)} item total + fees</div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Clock3 className="h-3.5 w-3.5" />
        {price.deliveryMins} mins | delivery Rs {price.deliveryFee}
      </div>
    </div>
  );
}
