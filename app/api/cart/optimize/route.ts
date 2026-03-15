import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { optimizeCart } from "@/lib/platforms";

const platformSchema = z.enum([
  "BLINKIT",
  "ZEPTO",
  "INSTAMART",
  "FLIPKART_MINUTES",
  "BIGBASKET_NOW",
  "DUNZO_DAILY",
  "JIOMART_EXPRESS",
  "AMAZON_FRESH"
]);

const bodySchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      preferredPlatform: platformSchema.optional()
    })
  ),
  pincode: z.string(),
  preferences: z.object({
    maxPlatforms: z.number().int().positive().max(8),
    maxWaitMins: z.number().int().positive().max(60)
  })
});

export async function POST(request: NextRequest) {
  const payload = bodySchema.parse(await request.json());
  const result = await optimizeCart(payload.items, payload.preferences, payload.pincode);

  return NextResponse.json(result);
}
