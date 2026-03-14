import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/pricing",
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/compare",
    "/dashboard/cart",
    "/dashboard/alerts",
    "/blog/blinkit-vs-zepto-bengaluru"
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date()
  }));
}
