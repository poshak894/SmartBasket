import { NextRequest, NextResponse } from "next/server";

import { defaultPincode } from "@/lib/constants";
import { redis } from "@/lib/redis/client";
import { getProductPrices } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const pincode = searchParams.get("pincode") ?? defaultPincode;

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const cacheKey = `prices:${productId}:${pincode}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, s-maxage=240, stale-while-revalidate=60"
        }
      });
    }
  }

  const data = await getProductPrices(productId, pincode);

  if (redis) {
    await redis.set(cacheKey, data, { ex: 240 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=240, stale-while-revalidate=60"
    }
  });
}
