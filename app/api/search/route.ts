import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "@/lib/auth/current-user";
import { defaultCity } from "@/lib/constants";
import { prisma } from "@/lib/prisma/client";
import { redis } from "@/lib/redis/client";
import { searchProducts } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  try {
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

    if (q.trim()) {
      try {
        const currentUser = await getCurrentAppUser();
        if (currentUser) {
          await prisma.search.create({
            data: {
              userId: currentUser.id,
              query: q.trim(),
              city
            }
          });
        }
      } catch {
        // Search logging should never block the user-facing response.
      }
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch search results";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
