"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type * as React from "react";
import { useRef, useState } from "react";

type BentoCardProps = {
  className?: string;
  children?: React.ReactNode;
  glowColor?: string;
  enableTilt?: boolean;
  enableGlow?: boolean;
  enableShine?: boolean;
  featured?: boolean;
};

export function BentoCard({
  className,
  children,
  glowColor = "hsl(var(--primary))",
  enableTilt = true,
  enableGlow = true,
  enableShine = true,
  featured = false,
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !enableTilt) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm",
        "transition-shadow duration-500",
        featured && "shadow-xl",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${glowColor} 0%, transparent 50%, ${glowColor} 100%)`,
          backgroundSize: "200% 200%",
        }}
        animate={
          isHovered
            ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner card with inset for border effect */}
      <div className="absolute inset-px rounded-[calc(1rem-1px)] bg-card" />

      {/* Glow effect following mouse */}
      {enableGlow && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}15, transparent 40%)`,
          }}
        />
      )}

      {/* Shine effect */}
      {enableShine && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ x: "-100%", opacity: 0 }}
          animate={isHovered ? { x: "100%", opacity: [0, 0.5, 0] } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
      )}

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Bottom gradient accent for featured cards */}
      {featured && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          }}
        />
      )}
    </motion.div>
  );
}

// Re-export alias for backwards compatibility
export { BentoCard as InteractiveBentoCard };

// Wrapper for scroll-triggered animations on mobile
type BentoCardMobileWrapperProps = {
  children: React.ReactNode;
  index?: number;
  className?: string;
};

export function BentoCardMobileWrapper({
  children,
  index = 0,
  className,
}: BentoCardMobileWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        margin: "-20% 0px -20% 0px", // Triggers when card is near center
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
