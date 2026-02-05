"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

type AnimatedTendrilProps = {
  path: string;
  className?: string;
  strokeWidth?: number;
  delay?: number;
  isVisible?: boolean;
  glowIntensity?: number;
};

export function AnimatedTendril({
  path,
  className,
  strokeWidth = 1.5,
  delay = 0,
  isVisible = false,
  glowIntensity = 0,
}: AnimatedTendrilProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      controls.start({
        pathLength: 1,
        opacity: 0.4 + glowIntensity * 0.3,
        transition: {
          pathLength: { duration: 1.2, delay, ease: "easeOut" },
          opacity: { duration: 0.4, delay },
        },
      });
    } else {
      controls.start({ pathLength: 0, opacity: 0 });
    }
  }, [isVisible, glowIntensity, delay, controls]);

  return (
    <motion.path
      d={path}
      className={className}
      fill="none"
      stroke="var(--navy-300)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      pathLength={0}
      opacity={0}
      animate={controls}
      style={{
        filter: glowIntensity > 0 ? `drop-shadow(0 0 ${4 * glowIntensity}px var(--navy-300))` : "none",
      }}
    />
  );
}
