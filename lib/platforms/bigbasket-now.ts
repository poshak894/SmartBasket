import { PlatformProvider } from "@/lib/platforms/shared";

export const bigbasketNowProvider: PlatformProvider = {
  platform: "BIGBASKET_NOW",
  async searchProducts() {
    return [];
  },
  async getProductPrices() {
    return [];
  }
};
