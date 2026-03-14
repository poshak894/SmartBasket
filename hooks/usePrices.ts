"use client";

import { useQuery } from "@tanstack/react-query";

export function usePrices(productId: string, pincode: string) {
  return useQuery({
    queryKey: ["prices", productId, pincode],
    queryFn: async () => {
      const response = await fetch(`/api/prices?productId=${productId}&pincode=${pincode}`);
      if (!response.ok) {
        throw new Error("Unable to load price comparison");
      }

      return response.json();
    },
    enabled: Boolean(productId)
  });
}
