import { NextRequest } from "next/server";

import { defaultPincode } from "@/lib/constants";
import { getProductPrices } from "@/lib/platforms";

const UPDATE_INTERVAL_MS = 5000;

function randomizePrice(price: number) {
  // +/- up to 5% swing to simulate realtime fluctuations
  const delta = (Math.random() - 0.5) * 0.1;
  return Number((price * (1 + delta)).toFixed(2));
}

function toSSE(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const pincode = url.searchParams.get("pincode") ?? defaultPincode;

  if (!productId) {
    return new Response(JSON.stringify({ error: "productId is required" }), { status: 400 });
  }

  // Use the mock price generator as the source of truth.
  const base = await getProductPrices(productId, pincode);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (payload: unknown) => controller.enqueue(encoder.encode(toSSE(payload)));

      const generateMessage = () => {
        const next = {
          ...base,
          updatedAt: new Date().toISOString(),
          prices: base.platforms.map((price) => {
            const newPrice = randomizePrice(price.price);
            const totalCost = Number((newPrice + price.deliveryFee + price.platformFee + price.packingFee + price.surgeFee).toFixed(2));
            return {
              ...price,
              price: newPrice,
              totalCost,
              fetchedAt: new Date().toISOString()
            };
          })
        };

        send(next);
      };

      // send initial payload immediately
      generateMessage();

      const interval = setInterval(generateMessage, UPDATE_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
