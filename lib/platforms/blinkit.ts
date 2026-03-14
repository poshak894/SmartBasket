import { PlatformProvider } from "@/lib/platforms/shared";
import { fetchPlatformJson } from "@/lib/platforms/shared";

type GenericOfferResponse = {
  results?: Array<{
    id?: string;
    name?: string;
    brand?: string;
    category?: string;
    imageUrl?: string;
    barcode?: string;
    price?: number;
    mrp?: number;
    deliveryFee?: number;
    platformFee?: number;
    packingFee?: number;
    surgeFee?: number;
    deliveryMins?: number;
    inStock?: boolean;
  }>;
};

function normalize(payload: GenericOfferResponse) {
  return (payload.results ?? [])
    .filter((item) => item.name && typeof item.price === "number")
    .map((item) => ({
      id: item.id,
      productName: item.name as string,
      brand: item.brand,
      category: item.category,
      imageUrl: item.imageUrl,
      barcode: item.barcode,
      price: item.price as number,
      mrp: item.mrp ?? item.price ?? 0,
      deliveryFee: item.deliveryFee ?? 0,
      platformFee: item.platformFee ?? 0,
      packingFee: item.packingFee ?? 0,
      surgeFee: item.surgeFee ?? 0,
      deliveryMins: item.deliveryMins ?? 15,
      inStock: item.inStock ?? true
    }));
}

export const blinkitProvider: PlatformProvider = {
  platform: "BLINKIT",
  async searchProducts({ query, pincode }) {
    const payload = await fetchPlatformJson<GenericOfferResponse>("BLINKIT", "/search", { q: query, pincode });
    return payload ? normalize(payload) : [];
  },
  async getProductPrices({ productName, pincode }) {
    const payload = await fetchPlatformJson<GenericOfferResponse>("BLINKIT", "/product", { q: productName, pincode });
    return payload ? normalize(payload) : [];
  }
};
