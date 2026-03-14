"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({ text }: { text: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();

    setMaskPosition({
      cx: `${((cursor.x - rect.left) / rect.width) * 100}%`,
      cy: `${((cursor.y - rect.top) / rect.height) * 100}%`
    });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 100"
      width="100%"
      height="100%"
      onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
    >
      <defs>
        <linearGradient id="brandGradient">
          <stop offset="0%" stopColor="#C08552" />
          <stop offset="50%" stopColor="#8C5A3C" />
          <stop offset="100%" stopColor="#4B2E2B" />
        </linearGradient>

        <motion.radialGradient id="mask" r="20%" initial={{ cx: "50%", cy: "50%" }} animate={maskPosition}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect width="100%" height="100%" fill="url(#mask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-transparent text-7xl font-bold stroke-[#4B2E2B]"
        strokeWidth="0.3"
      >
        {text}
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#brandGradient)"
        strokeWidth="0.4"
        mask="url(#textMask)"
        className="fill-transparent text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
