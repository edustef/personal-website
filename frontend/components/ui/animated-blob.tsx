"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedBlobProps = {
  className?: string;
  size?: number;
  gradient?: string;
  delay?: number;
  isVisible?: boolean;
};

export function AnimatedBlob({
  className,
  size = 300,
  gradient = "linear-gradient(135deg, var(--navy-400), var(--navy-200))",
  delay = 0,
  isVisible = false,
}: AnimatedBlobProps) {
  return (
    <motion.div
      className={cn(
        "absolute rounded-full pointer-events-none",
        className
      )}
      style={{
        width: size,
        height: size,
        background: gradient,
        filter: "blur(40px)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isVisible
          ? {
              opacity: [0.2, 0.25, 0.2],
              scale: [1, 1.05, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }
          : { opacity: 0, scale: 0.8 }
      }
      transition={
        isVisible
          ? {
              opacity: { duration: 0.8, delay },
              scale: {
                duration: 10,
                delay: delay + 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
              x: {
                duration: 12,
                delay: delay + 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 8,
                delay: delay + 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
          : { duration: 0.3 }
      }
    />
  );
}
