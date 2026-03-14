import Image from "next/image";

import { platformLogos } from "@/lib/constants";
import { Platform } from "@/types";

export function PlatformLogo({ platform, size = "md" }: { platform: Platform; size?: "sm" | "md" }) {
  const logo = platformLogos[platform];
  const dimensions = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const imageSize = size === "sm" ? 36 : 40;

  return (
    <div
      className={`flex ${dimensions} items-center justify-center overflow-hidden rounded-xl`}
      title={logo.alt}
      aria-label={logo.alt}
    >
      <Image src={logo.src} alt={logo.alt} width={imageSize} height={imageSize} className="h-full w-full rounded-xl object-contain" />
    </div>
  );
}
