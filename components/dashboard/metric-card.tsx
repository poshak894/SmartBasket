"use client";

import CountUp from "react-countup";
import { ArrowUpRight, Coins, Flame, ShoppingBag, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { MetricCardData } from "@/types";

const icons = {
  brand: { Icon: ShoppingBag, className: "bg-brand-50 text-brand-500" },
  success: { Icon: Coins, className: "bg-success-50 text-success-500" },
  warning: { Icon: Trophy, className: "bg-warning-50 text-warning-500" },
  danger: { Icon: Flame, className: "bg-danger-50 text-danger-500" }
};

export function MetricCard({ metric }: { metric: MetricCardData }) {
  const { Icon, className } = icons[metric.accent];

  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-elevated">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${className}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-success-500">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {metric.trend}%
          </div>
        </div>
        <div className="text-sm text-slate-500">{metric.label}</div>
        <div className="mt-2 text-3xl font-bold text-surface-900">
          {metric.prefix}
          <CountUp end={metric.value} duration={1.2} enableScrollSpy />
          {metric.suffix}
        </div>
        <div className="mt-2 text-xs text-slate-500">{metric.description}</div>
      </CardContent>
    </Card>
  );
}
