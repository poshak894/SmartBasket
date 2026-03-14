import { PlatformProvider } from "@/lib/platforms/shared";
import { fetchPlatformJson } from "@/lib/platforms/shared";

type GenericOfferResponse = {
  items?: Array<{
    id?: string;
    title?: string;
    brand?: string;
    category?: string;
    image?: string;
    barcode?: string;
    sellingPrice?: number;
    mrp?: number;
    fees?: {
      delivery?: number;
      platform?: number;
      packing?: number;
      surge?: number;
    };
    etaMins?: number;
    inStock?: boolean;
  }>;
};

function normalize(payload: GenericOfferResponse) {
  return (payload.items ?? [])
    .filter((item) => item.title && typeof item.sellingPrice === "number")
    .map((item) => ({
      id: item.id,
      productName: item.title as string,
      brand: item.brand,
      category: item.category,
      imageUrl: item.image,
      barcode: item.barcode,
      price: item.sellingPrice as number,
      mrp: item.mrp ?? item.sellingPrice ?? 0,
      deliveryFee: item.fees?.delivery ?? 0,
      platformFee: item.fees?.platform ?? 0,
      packingFee: item.fees?.packing ?? 0,
      surgeFee: item.fees?.surge ?? 0,
      deliveryMins: item.etaMins ?? 15,
      inStock: item.inStock ?? true
    }));
}

export const zeptoProvider: PlatformProvider = {
  platform: "ZEPTO",
  async searchProducts({ query, pincode }) {
    const payload = await fetchPlatformJson<GenericOfferResponse>("ZEPTO", "/search", { q: query, pincode });
    return payload ? normalize(payload) : [];
  },
  async getProductPrices({ productName, pincode }) {
    const payload = await fetchPlatformJson<GenericOfferResponse>("ZEPTO", "/product", { q: productName, pincode });
    return payload ? normalize(payload) : [];
  }
};
