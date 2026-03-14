"use client";

import { CSSProperties, useMemo } from "react";

type DottedGlowBackgroundProps = {
  color?: string;
  glowColor?: string;
  gap?: number;
  radius?: number;
  opacity?: number;
  speedMin?: number;
  speedMax?: number;
};

export function DottedGlowBackground({
  color = "rgba(75,46,43,0.7)",
  glowColor = "rgba(192,133,82,0.9)",
  gap = 14,
  radius = 1.8,
  opacity = 0.7,
  speedMin = 0.4,
  speedMax = 1.2
}: DottedGlowBackgroundProps) {
  const style = useMemo<CSSProperties>(() => {
    const avgSpeed = ((speedMin + speedMax) / 2).toFixed(2);

    return {
      opacity,
      backgroundImage: `
        radial-gradient(circle, ${color} ${radius}px, transparent ${radius + 0.2}px),
        radial-gradient(circle at 50% 50%, ${glowColor} 0px, transparent 120px)
      `,
      backgroundSize: `${gap}px ${gap}px, 100% 100%`,
      animation: `dottedGlowFloat ${avgSpeed}s ease-in-out infinite alternate`
    };
  }, [color, gap, glowColor, opacity, radius, speedMax, speedMin]);

  return (
    <>
      <div className="absolute inset-0" style={style} />
      <style jsx>{`
        @keyframes dottedGlowFloat {
          0% {
            transform: translate3d(0px, 0px, 0px) scale(1);
            filter: saturate(1);
          }
          100% {
            transform: translate3d(0px, -8px, 0px) scale(1.015);
            filter: saturate(1.08);
          }
        }
      `}</style>
    </>
  );
}
