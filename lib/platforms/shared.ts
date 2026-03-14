import { Platform } from "@/types";

export type ExternalPlatformOffer = {
  id?: string;
  productName: string;
  brand?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  barcode?: string | null;
  productExternalId?: string | null;
  price: number;
  mrp: number;
  deliveryFee?: number;
  platformFee?: number;
  packingFee?: number;
  surgeFee?: number;
  deliveryMins: number;
  inStock?: boolean;
};

export type PlatformSearchContext = {
  query: string;
  pincode: string;
  city?: string;
};

export type PlatformProductContext = {
  productId: string;
  productName: string;
  pincode: string;
  city?: string;
  barcode?: string;
};

export type PlatformProvider = {
  platform: Platform;
  searchProducts?: (context: PlatformSearchContext) => Promise<ExternalPlatformOffer[]>;
  getProductPrices?: (context: PlatformProductContext) => Promise<ExternalPlatformOffer[]>;
};

type PlatformConfig = {
  baseUrl?: string;
  apiKey?: string;
  cookie?: string;
  enabled: boolean;
};

function getPlatformKey(platform: Platform) {
  switch (platform) {
    case "BLINKIT":
      return "BLINKIT";
    case "ZEPTO":
      return "ZEPTO";
    case "INSTAMART":
      return "INSTAMART";
    case "FLIPKART_MINUTES":
      return "FLIPKART_MINUTES";
    case "BIGBASKET_NOW":
      return "BIGBASKET_NOW";
    case "DUNZO_DAILY":
      return "DMART_EXPRESS";
    case "JIOMART_EXPRESS":
      return "JIOMART";
    case "AMAZON_FRESH":
      return "AMAZON_FRESH";
  }
}

export function getPlatformConfig(platform: Platform): PlatformConfig {
  const key = getPlatformKey(platform);
  const enabled = process.env[`ENABLE_${key}_LIVE_FETCH`] === "true";

  return {
    enabled,
    baseUrl: process.env[`${key}_BASE_URL`],
    apiKey: process.env[`${key}_API_KEY`],
    cookie: process.env[`${key}_COOKIE`]
  };
}

export async function fetchPlatformJson<T>(platform: Platform, path: string, searchParams: Record<string, string | undefined>) {
  const config = getPlatformConfig(platform);

  if (!config.enabled || !config.baseUrl) {
    return null;
  }

  const url = new URL(path, config.baseUrl);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      ...(config.cookie ? { Cookie: config.cookie } : {})
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`${platform} request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export function safeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTotalCost(offer: ExternalPlatformOffer) {
  return Number(
    (
      offer.price +
      (offer.deliveryFee ?? 0) +
      (offer.platformFee ?? 0) +
      (offer.packingFee ?? 0) +
      (offer.surgeFee ?? 0)
    ).toFixed(2)
  );
}
