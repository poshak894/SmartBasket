import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { platformLabels } from "@/lib/constants";
import { CartOptimizationResult } from "@/types";

export function SplitOrderSummary({ optimization }: { optimization: CartOptimizationResult }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Optimized Split</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl bg-success-50 p-5">
          <div className="text-sm text-slate-500">You save</div>
          <div className="mt-1 text-4xl font-bold text-success-500">₹{optimization.savings}</div>
          <div className="mt-2 text-sm text-slate-600">Single platform: ₹{optimization.singlePlatformCost} • Optimized: ₹{optimization.totalCost}</div>
        </div>

        <div className="space-y-3">
          {optimization.splits.map((split) => (
            <div key={split.platform} className="rounded-2xl border border-surface-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-surface-900">{platformLabels[split.platform]}</div>
                  <div className="text-xs text-slate-500">{split.items.length} items • ETA {split.deliveryMins} mins</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-surface-900">₹{split.subtotal + split.fees}</div>
                  <div className="text-xs text-slate-500">incl. fees ₹{split.fees}</div>
                </div>
              </div>
              <Button asChild className="mt-4 w-full gap-2">
                <a href={split.deeplink} target="_blank" rel="noreferrer">
                  Place order
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
