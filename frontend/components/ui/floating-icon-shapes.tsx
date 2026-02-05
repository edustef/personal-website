"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type IconShapeProps = {
  icon: string;
  className?: string;
  delay?: number;
  isVisible?: boolean;
};

const shapeConfigs: Record<string, React.ReactNode[]> = {
  layers: [
    <rect key="1" width="12" height="4" rx="1" fill="currentColor" />,
    <rect key="2" width="10" height="4" rx="1" fill="currentColor" transform="translate(2, 6)" />,
    <rect key="3" width="8" height="4" rx="1" fill="currentColor" transform="translate(4, 12)" />,
  ],
  zap: [
    <polygon key="1" points="8,0 0,9 6,9 4,16 12,6 6,6" fill="currentColor" />,
  ],
  rocket: [
    <polygon key="1" points="8,0 16,14 8,10 0,14" fill="currentColor" />,
  ],
  palette: [
    <circle key="1" cx="4" cy="4" r="3" fill="currentColor" />,
    <circle key="2" cx="12" cy="6" r="2" fill="currentColor" />,
    <circle key="3" cx="6" cy="12" r="2.5" fill="currentColor" />,
  ],
  headphones: [
    <path key="1" d="M2,8 Q2,2 8,2 Q14,2 14,8" fill="none" stroke="currentColor" strokeWidth="2" />,
  ],
  globe: [
    <circle key="1" cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    <ellipse key="2" cx="8" cy="8" rx="3" ry="7" fill="none" stroke="currentColor" strokeWidth="1" />,
  ],
};

export function FloatingIconShapes({
  icon,
  className,
  delay = 0,
  isVisible = false,
}: IconShapeProps) {
  const shapes = shapeConfigs[icon] || shapeConfigs.layers;

  return (
    <motion.svg
      viewBox="0 0 16 16"
      className={cn("absolute size-4 text-navy-400/30 pointer-events-none", className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isVisible
          ? {
              opacity: 1,
              scale: 1,
              x: [0, 8, 0, -8, 0],
              y: [0, -6, 0, 6, 0],
            }
          : { opacity: 0, scale: 0.5 }
      }
      transition={
        isVisible
          ? {
              opacity: { duration: 0.4, delay },
              scale: { duration: 0.4, delay },
              x: { duration: 5, delay: delay + 0.4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4, delay: delay + 0.4, repeat: Infinity, ease: "easeInOut" },
            }
          : { duration: 0.3 }
      }
    >
      {shapes}
    </motion.svg>
  );
}
