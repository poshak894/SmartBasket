"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Blinkit", value: 38, color: "#F9C80E" },
  { name: "Zepto", value: 24, color: "#7C3AED" },
  { name: "Instamart", value: 18, color: "#F97316" },
  { name: "Flipkart Minutes", value: 16, color: "#2563EB" },
  { name: "BigBasket Now", value: 20, color: "#16A34A" },
  { name: "Dmart Express", value: 14, color: "#14B8A6" },
  { name: "Jio Mart", value: 12, color: "#EF4444" },
  { name: "Amazon Fresh", value: 11, color: "#111827" }
];

export function PlatformBreakdown() {
  const total = Math.min(data.reduce((sum, item) => sum + item.value, 0), 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative mx-auto h-[280px] w-full max-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
              <Pie data={data} innerRadius={72} outerRadius={108} paddingAngle={3} dataKey="value" stroke="none">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-surface-900">{total}%</div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Coverage</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between rounded-xl border border-surface-200 px-3 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm font-medium text-surface-900">{entry.name}</span>
              </div>
              <div className="text-sm font-semibold text-slate-500">{entry.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
