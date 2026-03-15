import { NextRequest } from "next/server";

import { defaultPincode } from "@/lib/constants";
import { getProductPrices } from "@/lib/platforms";

const UPDATE_INTERVAL_MS = 5000;

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

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (payload: unknown) => controller.enqueue(encoder.encode(toSSE(payload)));

      const generateMessage = async () => {
        const snapshot = await getProductPrices(productId, pincode);
        send(snapshot);
      };

      // send initial payload immediately
      void generateMessage();

      const interval = setInterval(() => {
        void generateMessage();
      }, UPDATE_INTERVAL_MS);

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
