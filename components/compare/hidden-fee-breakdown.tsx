"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { PlatformPrice } from "@/types";

export function HiddenFeeBreakdown({ price }: { price: PlatformPrice }) {
  return (
    <Accordion.Root type="single" collapsible className="rounded-2xl border border-surface-200 bg-surface-50">
      <Accordion.Item value="fees">
        <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-surface-900">
          View true cost
          <ChevronDown className="h-4 w-4" />
        </Accordion.Trigger>
        <Accordion.Content className="border-t border-surface-200 px-4 py-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Item price</span>
              <span>Rs {price.price}</span>
            </div>
            <div className="flex justify-between text-warning-500">
              <span>Delivery fee</span>
              <span>Rs {price.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-warning-500">
              <span>Platform fee</span>
              <span>Rs {price.platformFee}</span>
            </div>
            <div className="flex justify-between text-warning-500">
              <span>Packing fee</span>
              <span>Rs {price.packingFee}</span>
            </div>
            <div className="flex justify-between text-danger-500">
              <span>Surge fee</span>
              <span>Rs {price.surgeFee}</span>
            </div>
            <div className="flex justify-between border-t border-surface-200 pt-2 font-semibold text-surface-900">
              <span>Total you pay</span>
              <span>Rs {price.totalCost}</span>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
