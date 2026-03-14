"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("inline-flex h-11 items-center rounded-pill bg-surface-100 p-1 text-surface-900", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center rounded-pill px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-card",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
