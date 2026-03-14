"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Blinkit", value: 38, color: "#F9C80E" },
  { name: "Zepto", value: 24, color: "#7C3AED" },
  { name: "Instamart", value: 18, color: "#F97316" },
  { name: "BB Now", value: 20, color: "#16A34A" }
];

export function PlatformBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={105} paddingAngle={5} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
