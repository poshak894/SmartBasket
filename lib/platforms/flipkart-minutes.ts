import { PlatformProvider } from "@/lib/platforms/shared";

export const flipkartMinutesProvider: PlatformProvider = {
  platform: "FLIPKART_MINUTES",
  async searchProducts() {
    return [];
  },
  async getProductPrices() {
    return [];
  }
};
