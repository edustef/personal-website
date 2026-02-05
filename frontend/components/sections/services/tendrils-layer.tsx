"use client";

import { AnimatedTendril } from "@/components/ui/animated-tendril";

type TendrilsLayerProps = {
  isVisible: boolean;
};

// Organic curved paths that weave through the section
const tendrilPaths = [
  // Top-left to center-right sweep
  "M -50 100 Q 150 50, 300 150 T 600 120 T 900 180",
  // Bottom curve
  "M -30 350 Q 200 400, 400 320 T 700 380 T 950 300",
  // Middle diagonal
  "M 100 -20 Q 250 180, 450 200 T 750 150",
];

export function TendrilsLayer({ isVisible }: TendrilsLayerProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {tendrilPaths.map((path, index) => (
        <AnimatedTendril
          key={index}
          path={path}
          delay={0.2 + index * 0.2}
          isVisible={isVisible}
        />
      ))}
    </svg>
  );
}
