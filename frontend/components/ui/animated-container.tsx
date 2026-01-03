"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type * as React from "react";

const easeCurves = {
  smooth: [0.16, 1, 0.3, 1],
  gentle: [0.19, 1, 0.22, 1],
  veryGentle: [0.25, 1, 0.25, 1],
  snappy: [0.34, 1.56, 0.64, 1],
  linear: [0, 0, 1, 1],
} as const;

type EaseName = keyof typeof easeCurves;
type FadeDirection = "up" | "down" | "left" | "right" | "none";
type TriggerMode = "load" | "scroll";

type AnimatedContainerProps = Omit<
  React.ComponentProps<typeof motion.div>,
  "initial" | "animate" | "whileInView" | "transition" | "viewport"
> & {
  fadeDirection?: FadeDirection;
  duration?: number;
  delay?: number;
  ease?: EaseName;
  trigger?: TriggerMode;
  staggerIndex?: number;
  staggerDelay?: number;
  viewportMargin?: string;
  once?: boolean;
  offset?: number;
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
  duration = 0.6,
  delay = 0,
  ease = "smooth",
  trigger = "load",
  staggerIndex = 0,
  staggerDelay = 0.1,
  viewportMargin = "-80px",
  once = true,
  offset: customOffset,
  ...props
}: AnimatedContainerProps) {
  const baseOffset = axisOffset[fadeDirection];
  const offset =
    customOffset !== undefined
      ? fadeDirection === "up" || fadeDirection === "down"
        ? { y: customOffset }
        : fadeDirection === "left" || fadeDirection === "right"
          ? { x: customOffset }
          : {}
      : baseOffset;
  const totalDelay = delay + staggerIndex * staggerDelay;

  const animationProps =
    trigger === "scroll"
      ? {
          initial: { opacity: 0, ...offset },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once, margin: viewportMargin },
        }
      : {
          initial: { opacity: 0, ...offset },
          animate: { opacity: 1, x: 0, y: 0 },
        };

  return (
    <motion.div
      {...props}
      {...animationProps}
      className={cn(className)}
      transition={{ duration, delay: totalDelay, ease: easeCurves[ease] }}
    >
      {children}
    </motion.div>
  );
}
