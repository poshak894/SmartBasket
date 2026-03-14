"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavingsPoint } from "@/types";

export function SavingsChart({ data }: { data: SavingsPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E4E8F2" strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="savings" stroke="#1A6BFF" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
