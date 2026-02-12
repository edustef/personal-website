"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type * as React from "react";
import { useRef, useState } from "react";

type MagneticButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost" | "glow";
  size?: "default" | "sm" | "lg";
  magneticStrength?: number;
  glowColor?: string;
};

const variants = {
  default: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl",
  outline: "border-2 border-border bg-transparent hover:bg-accent/10",
  ghost: "bg-transparent hover:bg-accent/10",
  glow: "bg-primary text-primary-foreground shadow-lg",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  default: "h-11 px-6 text-base",
  lg: "h-13 px-8 text-lg",
};

export function MagneticButton({
  className,
  children,
  asChild = false,
  variant = "default",
  size = "default",
  magneticStrength = 0.3,
  glowColor = "hsl(var(--primary))",
  disabled,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // For inner content that moves opposite direction (parallax feel)
  const innerX = useTransform(x, (val) => val * -0.5);
  const innerY = useTransform(y, (val) => val * -0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (e.clientX - centerX) * magneticStrength;
    const distY = (e.clientY - centerY) * magneticStrength;

    mouseX.set(distX);
    mouseY.set(distY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const Comp = asChild ? Slot : "button";

  return (
    <motion.div
      className="relative inline-block"
      style={{ x, y }}
    >
      {/* Glow effect behind button */}
      {variant === "glow" && (
        <motion.div
          className="absolute inset-0 rounded-xl blur-xl"
          style={{
            background: glowColor,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          animate={{
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.96 }}
        disabled={disabled}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Animated gradient background on hover */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${glowColor}20 50%, transparent 100%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Shine sweep effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ x: "-100%", opacity: 0 }}
          animate={
            isHovered
              ? { x: "100%", opacity: [0, 0.3, 0] }
              : { x: "-100%", opacity: 0 }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transform: "skewX(-20deg)",
          }}
        />

        {/* Ripple effect from center */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: `radial-gradient(circle, ${glowColor}30 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Content with subtle parallax */}
        <motion.span
          className="relative z-10 flex items-center gap-2"
          style={{ x: innerX, y: innerY }}
        >
          {asChild ? (
            <Slot>{children}</Slot>
          ) : (
            children
          )}
        </motion.span>

        {/* Border glow on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            boxShadow: `inset 0 0 0 1px ${glowColor}`,
            opacity: isHovered ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
}

// Simple animated icon button
type IconButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

export function IconButton({
  className,
  children,
  asChild = false,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <motion.button
      className={cn(
        "relative flex items-center justify-center rounded-full p-3",
        "bg-accent/10 text-foreground backdrop-blur-sm",
        "transition-colors hover:bg-accent/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <motion.span
        className="relative z-10"
        whileHover={{ rotate: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {asChild ? <Slot>{children}</Slot> : children}
      </motion.span>
    </motion.button>
  );
}
