"use client";

import { useQuery } from "@tanstack/react-query";

import { SearchApiResponse } from "@/types";

export function useSearch(query: string, city: string) {
  return useQuery<SearchApiResponse>({
    queryKey: ["search", query, city],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error("Unable to fetch search results");
      }

      return response.json();
    },
    enabled: query.trim().length > 1
  });
}
