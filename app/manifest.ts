import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SmartBasket",
    short_name: "SmartBasket",
    description: "Compare instant delivery prices across India in real time.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1A6BFF"
  };
}
