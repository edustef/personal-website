"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type * as React from "react";
import { useRef, useState, useCallback } from "react";

type InteractiveCardProps = {
  className?: string;
  children?: React.ReactNode;
  glowColor?: string;
  enableTilt?: boolean;
  enableGlow?: boolean;
  enableShine?: boolean;
  featured?: boolean;
  index?: number;
};

export function InteractiveCard({
  className,
  children,
  glowColor = "var(--primary)",
  enableTilt = true,
  enableGlow = true,
  enableShine = true,
  featured = false,
  index = 0,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [6, -6]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-6, 6]),
    springConfig
  );

  const glowX = useSpring(
    useTransform(mouseX, [0, 1], [0, 100]),
    springConfig
  );
  const glowY = useSpring(
    useTransform(mouseY, [0, 1], [0, 100]),
    springConfig
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || !enableTilt) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(x);
      mouseY.set(y);
    },
    [enableTilt, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative h-full",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Card container */}
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-2xl border border-border/40",
            "bg-card/90 backdrop-blur-sm",
            "transition-shadow duration-500",
            isHovered && "shadow-2xl"
          )}
        >
          {/* Animated gradient border */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, hsl(${glowColor}) 0%, transparent 40%, transparent 60%, hsl(${glowColor}) 100%)`,
              opacity: isHovered ? 0.6 : 0,
            }}
          />

          {/* Inner background to create border effect */}
          <div className="absolute inset-px rounded-[calc(1rem-1px)] bg-card" />

          {/* Mouse-following glow */}
          {enableGlow && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) =>
                    `radial-gradient(400px circle at ${x}% ${y}%, hsl(${glowColor} / 0.15), transparent 50%)`
                ),
                opacity: isHovered ? 1 : 0,
              }}
            />
          )}

          {/* Shine sweep effect */}
          {enableShine && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              initial={{ x: "-100%", opacity: 0 }}
              animate={
                isHovered
                  ? { x: "100%", opacity: [0, 0.15, 0] }
                  : { x: "-100%", opacity: 0 }
              }
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                transform: "skewX(-15deg)",
              }}
            />
          )}

          {/* Content with z-index */}
          <div className="relative z-10 h-full">{children}</div>

          {/* Bottom accent line for featured cards */}
          {featured && (
            <motion.div
              className="absolute bottom-0 left-4 right-4 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 0%, hsl(${glowColor}) 50%, transparent 100%)`,
              }}
              animate={{
                opacity: isHovered ? 0.8 : 0.4,
                scaleX: isHovered ? 1 : 0.7,
              }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Subtle inner shadow for depth */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mobile-optimized scroll animation wrapper
type ScrollRevealCardProps = {
  children: React.ReactNode;
  index?: number;
  className?: string;
};

export function ScrollRevealCard({
  children,
  index = 0,
  className,
}: ScrollRevealCardProps) {
  return (
    <motion.div
      className={cn("h-full", className)}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.4, // Triggers when 40% visible (near center on mobile)
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Icon animation wrapper
type AnimatedIconProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedIcon({ children, className }: AnimatedIconProps) {
  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={{
        scale: 1.1,
        rotate: [0, -10, 10, 0],
      }}
      transition={{
        duration: 0.4,
        rotate: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}
