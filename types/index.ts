export type Plan = "FREE" | "PRO" | "TEAM";

export type Platform =
  | "BLINKIT"
  | "ZEPTO"
  | "INSTAMART"
  | "FLIPKART_MINUTES"
  | "BIGBASKET_NOW"
  | "DUNZO_DAILY"
  | "JIOMART_EXPRESS"
  | "AMAZON_FRESH";

export type Product = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  imageUrl?: string;
  barcode?: string;
  tags?: string[];
};

export type PlatformPrice = {
  id: string;
  productId: string;
  platform: Platform;
  price: number;
  mrp: number;
  deliveryFee: number;
  platformFee: number;
  packingFee: number;
  surgeFee: number;
  totalCost: number;
  deliveryMins: number;
  inStock: boolean;
  pincode: string;
  fetchedAt: string;
};

export type ProductWithPrices = Product & {
  prices: PlatformPrice[];
  lowestPrice: number;
  savingsPotential: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
  preferredPlatform?: Platform;
};

export type PlatformSplit = {
  platform: Platform;
  items: Array<CartItem & { unitPrice: number; totalPrice: number }>;
  subtotal: number;
  fees: number;
  deliveryMins: number;
  deeplink: string;
};

export type CartOptimizationResult = {
  splits: PlatformSplit[];
  totalCost: number;
  savings: number;
  singlePlatformCost: number;
};

export type MetricCardData = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  accent: "brand" | "success" | "warning" | "danger";
  description: string;
};

export type SavingsPoint = {
  label: string;
  savings: number;
  comparisons: number;
};

export type PriceAlert = {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  platform?: Platform;
  triggered: boolean;
};

export type SearchApiResponse = {
  products: ProductWithPrices[];
  suggestions: string[];
  total: number;
};
