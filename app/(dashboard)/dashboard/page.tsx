import { MetricCard } from "@/components/dashboard/metric-card";
import { PlatformBreakdown } from "@/components/dashboard/platform-breakdown";
import { SavingsChart } from "@/components/dashboard/savings-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics, mockAlerts, sampleOptimization, savingsSeries } from "@/lib/mock/data";
import { platformLabels } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SavingsChart data={savingsSeries} />
        <PlatformBreakdown />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent comparisons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Amul Butter 500g", "Fortune Atta 5kg", "Dove Shampoo 650ml"].map((product, index) => (
              <div key={product} className="flex items-center justify-between rounded-2xl border border-surface-200 p-4">
                <div>
                  <div className="font-semibold text-surface-900">{product}</div>
                  <div className="text-sm text-slate-500">{platformLabels[sampleOptimization.splits[index % sampleOptimization.splits.length].platform]} won with lowest true cost</div>
                </div>
                <div className="text-sm font-semibold text-success-500">Saved ₹{18 + index * 8}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-surface-200 p-4">
                <div className="font-semibold text-surface-900">{alert.productName}</div>
                <div className="mt-2 text-sm text-slate-500">
                  Target ₹{alert.targetPrice} • Current ₹{alert.currentPrice} • {alert.platform ? platformLabels[alert.platform] : "Any platform"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
