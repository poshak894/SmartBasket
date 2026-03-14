"use client";

import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <QueryProvider>
        {children}
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </AuthProvider>
  );
}
