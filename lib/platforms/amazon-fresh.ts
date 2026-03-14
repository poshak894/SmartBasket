import { PlatformProvider } from "@/lib/platforms/shared";

export const amazonFreshProvider: PlatformProvider = {
  platform: "AMAZON_FRESH",
  async searchProducts() {
    return [];
  },
  async getProductPrices() {
    return [];
  }
};
