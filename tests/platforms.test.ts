import { describe, expect, it } from "vitest";

import { optimizeCart, searchProducts } from "@/lib/platforms";

describe("platform aggregator", () => {
  it("returns search results for seeded products", async () => {
    const results = await searchProducts("amul", "Bengaluru");
    expect(results.total).toBeGreaterThan(0);
  });

  it("optimizes a cart into a cheaper split", async () => {
    const result = await optimizeCart(
      [
        { productId: "amul-butter", quantity: 1 },
        { productId: "fortune-atta", quantity: 1 }
      ],
      { maxPlatforms: 2, maxWaitMins: 30 }
    );

    expect(result.totalCost).toBeLessThanOrEqual(result.singlePlatformCost);
  });
});
