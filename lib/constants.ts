import { Platform } from "@/types";

export const SITE_URL = "https://kartcompare.in";
export const fallbackProductImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";

export const platformLabels: Record<Platform, string> = {
  BLINKIT: "Blinkit",
  ZEPTO: "Zepto",
  INSTAMART: "Instamart",
  FLIPKART_MINUTES: "Flipkart Minutes",
  BIGBASKET_NOW: "BigBasket Now",
  DUNZO_DAILY: "Dunzo Daily",
  JIOMART_EXPRESS: "JioMart Express",
  AMAZON_FRESH: "Amazon Fresh"
};

export const defaultCity = "Bengaluru";
export const defaultPincode = "560001";
