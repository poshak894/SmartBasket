import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma/client";

const alertSchema = z.object({
  productId: z.string(),
  targetPrice: z.number().positive(),
  platform: z.enum([
    "BLINKIT",
    "ZEPTO",
    "INSTAMART",
    "FLIPKART_MINUTES",
    "BIGBASKET_NOW",
    "DUNZO_DAILY",
    "JIOMART_EXPRESS",
    "AMAZON_FRESH"
  ]).optional()
});

export async function GET() {
  try {
    const currentUser = await getCurrentAppUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await prisma.priceAlert.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch alerts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentAppUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = alertSchema.parse(await request.json());

    const alert = await prisma.priceAlert.create({
      data: {
        userId: currentUser.id,
        productId: payload.productId,
        platform: payload.platform,
        targetPrice: payload.targetPrice,
        triggered: false
      }
    });

    return NextResponse.json({
      alert,
      message: "Alert created successfully."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid alert payload", issues: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to create alert";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
