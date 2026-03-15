"use client";

import { Minus, Plus, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { SplitOrderSummary } from "@/components/cart/split-order-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartOptimizer } from "@/hooks/useCart";
import { sampleOptimization } from "@/lib/mock/data";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { useTeamStore } from "@/store/teamStore";

export function SmartCartPanel() {
  const { items, productMap, updateQuantity, removeItem } = useCartStore();
  const { pincode } = useLocationStore();
  const shareCart = useTeamStore((state) => state.shareCart);
  const optimizer = useCartOptimizer();
  const cartFingerprint = useMemo(
    () => JSON.stringify(items.map((item) => ({ productId: item.productId, quantity: item.quantity, preferredPlatform: item.preferredPlatform }))),
    [items]
  );

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      optimizer.mutate({
        items,
        pincode,
        preferences: { maxPlatforms: 2, maxWaitMins: 30 }
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [cartFingerprint, items, optimizer.mutate, pincode]);

  if (!items.length) {
    return (
      <Card className="p-10 text-center">
        <CardTitle>Start comparing to build your Smart Cart</CardTitle>
        <p className="mt-3 text-sm text-slate-500">Add products from compare results and we’ll split orders across platforms for the lowest true checkout cost.</p>
      </Card>
    );
  }

  const optimization = optimizer.data ?? sampleOptimization;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Cart Items</CardTitle>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => {
                shareCart("Weekly grocery cart", items.reduce((sum, item) => sum + item.quantity, 0));
                toast.success("Cart shared with your Team workspace.");
              }}
            >
              <Share2 className="h-4 w-4" />
              Share with team
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => {
            const product = productMap[item.productId];
            return (
              <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-surface-200 p-4">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-surface-900">{product?.name ?? item.productId}</div>
                  <div className="text-sm text-slate-500">{product?.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="icon" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-8 text-center font-mono text-sm">{item.quantity}</div>
                  <Button variant="secondary" size="icon" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <SplitOrderSummary optimization={optimization} />
    </div>
  );
}
