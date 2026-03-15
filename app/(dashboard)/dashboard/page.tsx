import Link from "next/link";
import { ArrowRight, BellRing, Clock3, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { PlatformBreakdown } from "@/components/dashboard/platform-breakdown";
import { SavingsChart } from "@/components/dashboard/savings-chart";
import { TeamWorkspace } from "@/components/team/team-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { platformLabels } from "@/lib/constants";
import { dashboardMetrics, mockAlerts, mockProductCatalog, sampleOptimization, savingsSeries } from "@/lib/mock/data";

const recentComparisons = [
  { product: "Amul Butter 500g", winner: "BLINKIT", saved: 24, eta: "9 min", hiddenFees: 9 },
  { product: "Fortune Atta 5kg", winner: "BIGBASKET_NOW", saved: 33, eta: "18 min", hiddenFees: 13 },
  { product: "Dove Shampoo 650ml", winner: "ZEPTO", saved: 41, eta: "11 min", hiddenFees: 13 }
] as const;

const categoryInsights = [
  { category: "Dairy", savings: 212, share: 34 },
  { category: "Staples", savings: 185, share: 28 },
  { category: "Personal Care", savings: 146, share: 22 },
  { category: "Snacks", savings: 92, share: 16 }
];

const quickActions = [
  { href: "/dashboard/compare", label: "Run compare", icon: Sparkles, copy: "Search a product and compare true checkout prices." },
  { href: "/dashboard/cart", label: "Open Smart Cart", icon: Target, copy: "Split your basket to save the maximum amount." },
  { href: "/dashboard/alerts", label: "Manage alerts", icon: BellRing, copy: "Track targets and get notified when prices drop." }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(192,133,82,0.18),rgba(255,248,240,0.96))] p-6 shadow-card">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Badge className="mb-4 bg-white/70 text-brand-dark">Today&apos;s Smart Summary</Badge>
            <h1 className="max-w-2xl text-3xl font-black text-surface-900 md:text-4xl">You&apos;re ahead of hidden fees and impulse overpaying.</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              SmartBasket tracked your best checkout windows, surfaced platform fees, and kept your savings momentum intact across the week.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">This week</div>
                <div className="mt-2 text-2xl font-bold text-surface-900">Rs 295</div>
                <div className="mt-1 text-sm text-slate-500">Savings tracked over the last 7 days</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Best window</div>
                <div className="mt-2 text-2xl font-bold text-surface-900">7:30 PM</div>
                <div className="mt-1 text-sm text-slate-500">Lowest fee spikes in your area</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cart edge</div>
                <div className="mt-2 text-2xl font-bold text-surface-900">Rs 71</div>
                <div className="mt-1 text-sm text-slate-500">Average Smart Cart optimization win</div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-3xl border border-white/70 bg-white/75 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-semibold text-surface-900">{action.label}</div>
                    <div className="mt-1 text-sm text-slate-500">{action.copy}</div>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            {recentComparisons.map((comparison) => (
              <div key={comparison.product} className="rounded-2xl border border-surface-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-surface-900">{comparison.product}</div>
                    <div className="mt-1 text-sm text-slate-500">{platformLabels[comparison.winner]} won with the lowest true cost</div>
                  </div>
                  <div className="rounded-full bg-success-50 px-3 py-1 text-sm font-semibold text-success-500">Saved Rs {comparison.saved}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-50 px-3 py-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {comparison.eta}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-3 py-1 text-warning-500">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Hidden fees Rs {comparison.hiddenFees}
                  </span>
                </div>
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-surface-900">{alert.productName}</div>
                    <div className="mt-2 text-sm text-slate-500">
                      Target Rs {alert.targetPrice} · Current Rs {alert.currentPrice} · {alert.platform ? platformLabels[alert.platform] : "Any platform"}
                    </div>
                  </div>
                  <Badge variant={alert.currentPrice <= alert.targetPrice ? "success" : "outline"}>
                    {alert.currentPrice <= alert.targetPrice ? "Ready" : `Rs ${alert.currentPrice - alert.targetPrice} away`}
                  </Badge>
                </div>
              </div>
            ))}
            <Button asChild className="w-full">
              <Link href="/dashboard/alerts">Open alerts panel</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Category savings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryInsights.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-surface-900">{item.category}</span>
                  <span className="text-slate-500">Rs {item.savings}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${item.share}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SmartBasket insights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="font-semibold text-surface-900">Best-performing basket</div>
              <div className="mt-2 text-sm text-slate-500">
                Your staples-heavy carts are currently saving the most, especially when Blinkit and BigBasket Now split the order.
              </div>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-warning-50 text-warning-500">
                <BellRing className="h-5 w-5" />
              </div>
              <div className="font-semibold text-surface-900">Alert opportunity</div>
              <div className="mt-2 text-sm text-slate-500">
                {mockAlerts[0].productName} is your closest alert. A drop of Rs {mockAlerts[0].currentPrice - mockAlerts[0].targetPrice} will trigger it.
              </div>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-success-50 text-success-500">
                <Target className="h-5 w-5" />
              </div>
              <div className="font-semibold text-surface-900">Optimization snapshot</div>
              <div className="mt-2 text-sm text-slate-500">
                Smart Cart is currently saving Rs {sampleOptimization.savings} compared with a single-platform checkout.
              </div>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-danger-50 text-danger-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="font-semibold text-surface-900">Most-searched item</div>
              <div className="mt-2 text-sm text-slate-500">
                {mockProductCatalog[0].name} is trending in your dashboard history and shows one of your strongest fee-adjusted savings patterns.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <TeamWorkspace compact />
    </div>
  );
}
