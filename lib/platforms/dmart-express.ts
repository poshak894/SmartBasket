import { PlatformProvider } from "@/lib/platforms/shared";

export const dmartExpressProvider: PlatformProvider = {
  platform: "DUNZO_DAILY",
  async searchProducts() {
    return [];
  },
  async getProductPrices() {
    return [];
  }
};
