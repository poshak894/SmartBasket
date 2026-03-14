"use client";

import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/providers/query-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
