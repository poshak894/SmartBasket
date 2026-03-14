import { PlatformProvider } from "@/lib/platforms/shared";
import { fetchPlatformJson } from "@/lib/platforms/shared";

type GenericOfferResponse = {
  products?: Array<{
    sku?: string;
    name?: string;
    brand?: string;
    category?: string;
    imageUrl?: string;
    barcode?: string;
    price?: number;
    mrp?: number;
    fees?: {
      deliveryFee?: number;
      platformFee?: number;
      packingFee?: number;
      surgeFee?: number;
    };
    eta?: number;
    inStock?: boolean;
  }>;
};

function normalize(payload: GenericOfferResponse) {
  return (payload.products ?? [])
    .filter((item) => item.name && typeof item.price === "number")
    .map((item) => ({
      id: item.sku,
      productName: item.name as string,
      brand: item.brand,
      category: item.category,
      imageUrl: item.imageUrl,
      barcode: item.barcode,
      price: item.price as number,
      mrp: item.mrp ?? item.price ?? 0,
      deliveryFee: item.fees?.deliveryFee ?? 0,
      platformFee: item.fees?.platformFee ?? 0,
      packingFee: item.fees?.packingFee ?? 0,
      surgeFee: item.fees?.surgeFee ?? 0,
      deliveryMins: item.eta ?? 15,
      inStock: item.inStock ?? true
    }));
}

export const instamartProvider: PlatformProvider = {
  platform: "INSTAMART",
  async searchProducts({ query, pincode }) {
    const payload = await fetchPlatformJson<GenericOfferResponse>("INSTAMART", "/search", { q: query, pincode });
    return payload ? normalize(payload) : [];
  },
  async getProductPrices({ productName, pincode }) {
    const payload = await fetchPlatformJson<GenericOfferResponse>("INSTAMART", "/product", { q: productName, pincode });
    return payload ? normalize(payload) : [];
  }
};
