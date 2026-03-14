import { NextRequest, NextResponse } from "next/server";

import { defaultCity } from "@/lib/constants";
import { redis } from "@/lib/redis/client";
import { searchProducts } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const city = searchParams.get("city") ?? defaultCity;
  const cacheKey = `search:${city}:${q}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60"
        }
      });
    }
  }

  const data = await searchProducts(q, city);

  if (redis) {
    await redis.set(cacheKey, data, { ex: 300 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60"
    }
  });
}
