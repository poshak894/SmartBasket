import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const alertSchema = z.object({
  productId: z.string(),
  targetPrice: z.number().positive(),
  platform: z.string().optional()
});

export async function POST(request: NextRequest) {
  const payload = alertSchema.parse(await request.json());

  return NextResponse.json({
    id: crypto.randomUUID(),
    ...payload,
    triggered: false,
    message: "Alert created. Hook this route to Supabase + Resend for persistence and email triggers."
  });
}
