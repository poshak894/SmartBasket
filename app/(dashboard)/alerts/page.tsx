import { BellRing } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAlerts } from "@/lib/mock/data";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-surface-900">Price Alerts</h1>
        <p className="mt-2 text-slate-600">Set target prices and let SmartBasket notify you by email or browser push when a deal lands.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {mockAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader>
              <CardTitle>{alert.productName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BellRing className="h-4 w-4 text-brand-500" />
                Target ₹{alert.targetPrice} • Current ₹{alert.currentPrice}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
