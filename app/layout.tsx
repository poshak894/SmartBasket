import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { SITE_URL } from "@/lib/constants";

import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SmartBasket - Compare Instant Delivery Prices in India",
    template: "%s | SmartBasket"
  },
  description:
    "Compare real-time prices across Blinkit, Zepto, Instamart, Flipkart Minutes and more. Find the cheapest instant delivery option with Smart Cart optimization and hidden fee detection.",
  keywords: [
    "AI grocery assistant India",
    "quick commerce comparison",
    "grocery price compare",
    "blinkit vs zepto",
    "smart cart optimizer"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SmartBasket",
    images: [{ url: "/og", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@kartcompare",
    images: ["/og"]
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: SITE_URL
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
