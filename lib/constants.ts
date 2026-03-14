import { Platform } from "@/types";

export const SITE_URL = "https://kartcompare.in";
export const fallbackProductImage = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80";
export const amulBrandLogo = "/icons/AbLogo.jpeg";

export const platformLabels: Record<Platform, string> = {
  BLINKIT: "Blinkit",
  ZEPTO: "Zepto",
  INSTAMART: "Instamart",
  FLIPKART_MINUTES: "Flipkart Minutes",
  BIGBASKET_NOW: "BigBasket Now",
  DUNZO_DAILY: "Dmart Express",
  JIOMART_EXPRESS: "Jio Mart",
  AMAZON_FRESH: "Amazon Fresh"
};

export const platformLogos: Record<Platform, { src: string; alt: string; bg: string }> = {
  BLINKIT: { src: "/icons/blinkitLogo.jpeg", alt: "Blinkit logo", bg: "#F9C80E" },
  ZEPTO: { src: "/icons/zLogo.jpeg", alt: "Zepto logo", bg: "#7C3AED" },
  INSTAMART: { src: "/icons/imLogo.jpeg", alt: "Instamart logo", bg: "#F97316" },
  FLIPKART_MINUTES: { src: "/icons/fmLogo.jpeg", alt: "Flipkart Minutes logo", bg: "#2563EB" },
  BIGBASKET_NOW: { src: "/icons/bbLogo.png", alt: "BigBasket Now logo", bg: "#16A34A" },
  DUNZO_DAILY: { src: "/icons/DmartLogo.jpeg", alt: "Dmart Express logo", bg: "#14B8A6" },
  JIOMART_EXPRESS: { src: "/icons/JmLogo.jpeg", alt: "Jio Mart logo", bg: "#EF4444" },
  AMAZON_FRESH: { src: "/icons/afLogo.jpeg", alt: "Amazon Fresh logo", bg: "#111827" }
};

export const defaultCity = "Bengaluru";
export const defaultPincode = "560001";
