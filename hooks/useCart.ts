"use client";

import { useMutation } from "@tanstack/react-query";

import { CartItem } from "@/types";

export function useCartOptimizer() {
  return useMutation({
    mutationFn: async (payload: { items: CartItem[]; pincode: string; preferences: { maxPlatforms: number; maxWaitMins: number } }) => {
      const response = await fetch("/api/cart/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to optimize cart");
      }

      return response.json();
    }
  });
}
