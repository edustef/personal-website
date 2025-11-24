"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const easeCurves = {
  smooth: [0.16, 1, 0.3, 1],
  gentle: [0.19, 1, 0.22, 1],
  snappy: [0.34, 1.56, 0.64, 1],
  linear: [0, 0, 1, 1],
} as const;

type EaseName = keyof typeof easeCurves;
type FadeDirection = "up" | "down" | "left" | "right" | "none";

type AnimatedContainerProps = Omit<
  React.ComponentProps<typeof motion.div>,
  "initial" | "animate" | "transition"
> & {
  fadeDirection?: FadeDirection;
  duration?: number;
  delay?: number;
  ease?: EaseName;
};

const axisOffset: Record<FadeDirection, Partial<Record<"x" | "y", number>>> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  none: {},
};

export function AnimatedContainer({
  className,
  children,
  fadeDirection = "up",
  duration = 3,
  delay = 0.2,
  ease = "smooth",
  ...props
}: AnimatedContainerProps) {
  const offset = axisOffset[fadeDirection];

  return (
    <motion.div
      {...props}
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: easeCurves[ease] }}
    >
      {children}
    </motion.div>
  );
}
