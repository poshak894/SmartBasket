import { PlatformProvider } from "@/lib/platforms/shared";

export const jiomartProvider: PlatformProvider = {
  platform: "JIOMART_EXPRESS",
  async searchProducts() {
    return [];
  },
  async getProductPrices() {
    return [];
  }
};
