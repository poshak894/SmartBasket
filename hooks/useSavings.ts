"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardMetrics, savingsSeries } from "@/lib/mock/data";

export function useSavings() {
  return useQuery({
    queryKey: ["savings-dashboard"],
    queryFn: async () => ({
      metrics: dashboardMetrics,
      savingsSeries
    }),
    initialData: {
      metrics: dashboardMetrics,
      savingsSeries
    }
  });
}
