import { CartOptimizationResult, MetricCardData, Platform, PlatformPrice, PriceAlert, Product, ProductWithPrices, SavingsPoint } from "@/types";

export const platforms: Array<{ id: Platform; label: string; color: string; etaLabel: string }> = [
  { id: "BLINKIT", label: "Blinkit", color: "#F9C80E", etaLabel: "9 min" },
  { id: "ZEPTO", label: "Zepto", color: "#7C3AED", etaLabel: "11 min" },
  { id: "INSTAMART", label: "Instamart", color: "#F97316", etaLabel: "14 min" },
  { id: "FLIPKART_MINUTES", label: "Flipkart Minutes", color: "#2563EB", etaLabel: "16 min" },
  { id: "BIGBASKET_NOW", label: "BB Now", color: "#16A34A", etaLabel: "18 min" },
  { id: "DUNZO_DAILY", label: "Dunzo Daily", color: "#14B8A6", etaLabel: "20 min" },
  { id: "JIOMART_EXPRESS", label: "JioMart Express", color: "#EF4444", etaLabel: "22 min" },
  { id: "AMAZON_FRESH", label: "Amazon Fresh", color: "#111827", etaLabel: "25 min" }
];

export const mockProducts: Product[] = [
  { id: "amul-butter", name: "Amul Butter 500g", brand: "Amul", category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1589985270958-b3f9b7a7fda0?auto=format&fit=crop&w=400&q=80", tags: ["butter", "dairy", "breakfast"] },
  { id: "maggi-noodles", name: "Maggi 2-Minute Noodles", brand: "Nestle", category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=400&q=80", tags: ["instant", "noodles"] },
  { id: "fortune-atta", name: "Fortune Chakki Fresh Atta 5kg", brand: "Fortune", category: "Staples", imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80", tags: ["atta", "flour"] },
  { id: "dove-shampoo", name: "Dove Intense Repair Shampoo 650ml", brand: "Dove", category: "Personal Care", imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80", tags: ["shampoo", "hair care"] }
];

function makePrices(productId: string, basePrice: number): PlatformPrice[] {
  return platforms.map((platform, index) => {
    const price = Number((basePrice + index * 2.5 + (index % 2 === 0 ? -1.25 : 1.75)).toFixed(2));
    const deliveryFee = index < 2 ? 0 : 9 + index;
    const platformFee = index % 3 === 0 ? 5 : 3;
    const packingFee = index > 4 ? 8 : 4;
    const surgeFee = index === 1 || index === 6 ? 6 : 0;
    const totalCost = price + deliveryFee + platformFee + packingFee + surgeFee;

    return {
      id: `${productId}-${platform.id}`,
      productId,
      platform: platform.id,
      price,
      mrp: Number((basePrice + 22).toFixed(2)),
      deliveryFee,
      platformFee,
      packingFee,
      surgeFee,
      totalCost,
      deliveryMins: 9 + index * 2,
      inStock: platform.id !== "DUNZO_DAILY",
      pincode: "560001",
      fetchedAt: new Date().toISOString()
    };
  });
}

export const mockProductCatalog: ProductWithPrices[] = [
  { ...mockProducts[0], prices: makePrices("amul-butter", 278), lowestPrice: 278, savingsPotential: 24 },
  { ...mockProducts[1], prices: makePrices("maggi-noodles", 68), lowestPrice: 68, savingsPotential: 18 },
  { ...mockProducts[2], prices: makePrices("fortune-atta", 292), lowestPrice: 292, savingsPotential: 33 },
  { ...mockProducts[3], prices: makePrices("dove-shampoo", 441), lowestPrice: 441, savingsPotential: 41 }
];

export const dashboardMetrics: MetricCardData[] = [
  { label: "Total saved", value: 847, prefix: "₹", trend: 24, accent: "success", description: "vs last month" },
  { label: "Comparisons", value: 134, trend: 18, accent: "brand", description: "in the last 30 days" },
  { label: "Best platform", value: 8, suffix: " wins", trend: 12, accent: "warning", description: "Blinkit leads your area" },
  { label: "Savings streak", value: 19, suffix: " days", trend: 8, accent: "danger", description: "daily smarter checkouts" }
];

export const savingsSeries: SavingsPoint[] = [
  { label: "Week 1", savings: 126, comparisons: 18 },
  { label: "Week 2", savings: 182, comparisons: 27 },
  { label: "Week 3", savings: 244, comparisons: 35 },
  { label: "Week 4", savings: 295, comparisons: 41 }
];

export const mockAlerts: PriceAlert[] = [
  { id: "1", productId: "amul-butter", productName: "Amul Butter 500g", targetPrice: 269, currentPrice: 278, platform: "BLINKIT", triggered: false },
  { id: "2", productId: "fortune-atta", productName: "Fortune Chakki Fresh Atta 5kg", targetPrice: 285, currentPrice: 292, platform: "BIGBASKET_NOW", triggered: false }
];

export const sampleOptimization: CartOptimizationResult = {
  splits: [
    {
      platform: "BLINKIT",
      items: [{ productId: "amul-butter", quantity: 1, unitPrice: 278, totalPrice: 278 }],
      subtotal: 278,
      fees: 9,
      deliveryMins: 10,
      deeplink: "https://blinkit.com"
    },
    {
      platform: "BIGBASKET_NOW",
      items: [{ productId: "fortune-atta", quantity: 1, unitPrice: 292, totalPrice: 292 }],
      subtotal: 292,
      fees: 13,
      deliveryMins: 18,
      deeplink: "https://bigbasket.com"
    }
  ],
  totalCost: 592,
  savings: 71,
  singlePlatformCost: 663
};
