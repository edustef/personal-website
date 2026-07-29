"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type * as React from "react";
import { useCallback, useRef, useState } from "react";

type ServiceCardProps = {
  children: React.ReactNode;
  index: number;
  featured?: boolean;
  glowColor?: string;
  className?: string;
};

export function ServiceCard({
  children,
  index,
  featured = false,
  glowColor = "217 91% 60%",
  className,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 120 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [2, -2]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-2, 2]),
    springConfig
  );

  const glowX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={cn("group relative min-w-0", className)}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.6,
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
          rotateX,
          rotateY,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-2xl border border-border/30",
            "bg-card/80 backdrop-blur-sm",
            "transition-all duration-500",
            isHovered && "shadow-2xl border-border/50"
          )}
        >
          {/* Animated gradient border on hover */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background: `linear-gradient(135deg, hsl(${glowColor} / 0.6) 0%, transparent 40%, transparent 60%, hsl(${glowColor} / 0.4) 100%)`,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Inner background */}
          <div className="absolute inset-px rounded-[calc(1rem-1px)] bg-card" />

          {/* Mouse-following glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(500px circle at ${x}% ${y}%, hsl(${glowColor} / 0.12), transparent 50%)`
              ),
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10 h-full">{children}</div>

          {/* Featured accent bar */}
          {featured && (
            <motion.div
              className="absolute bottom-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 0%, hsl(${glowColor}) 50%, transparent 100%)`,
              }}
              animate={{
                opacity: isHovered ? 0.8 : 0.3,
                scaleX: isHovered ? 1 : 0.6,
              }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

type ServiceCardMobileProps = {
  children: React.ReactNode;
  index: number;
  glowColor?: string;
  icon: React.ReactNode;
  bgPattern?: React.ReactNode;
};

export function ServiceCardMobile({
  children,
  index,
  glowColor = "217 91% 60%",
  icon,
  bgPattern,
}: ServiceCardMobileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useInView(ref, { amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      className="group relative min-w-0 h-full"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        scale: isActive ? 1 : 0.94,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ scale: isActive ? 1.01 : 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-2xl border border-border/30",
            "bg-card/80 backdrop-blur-sm",
            "transition-all duration-500",
            isActive && "shadow-2xl border-border/50"
          )}
        >
          {/* Animated gradient border when in view */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background: `linear-gradient(135deg, hsl(${glowColor} / 0.6) 0%, transparent 40%, transparent 60%, hsl(${glowColor} / 0.4) 100%)`,
            }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Inner background */}
          <div className="absolute inset-px rounded-[calc(1rem-1px)] bg-card" />

          {/* Center glow when in view */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(500px circle at 50% 50%, hsl(${glowColor} / 0.12), transparent 50%)`,
            }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10 h-full">
            {bgPattern}
            <div className="relative p-6 flex flex-col h-full">
              {/* Icon with animation */}
              <motion.div
                className="mb-4 inline-flex self-start rounded-lg bg-primary/10 p-2.5"
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isActive
                    ? "hsl(var(--primary) / 0.2)"
                    : "hsl(var(--primary) / 0.1)",
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  animate={{ rotate: isActive ? 6 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {icon}
                </motion.div>
              </motion.div>
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

type ServicesCTAProps = {
  ctaUrl: string;
  ctaText: string;
};

export function ServicesCTA({ ctaUrl, ctaText }: ServicesCTAProps) {
  return (
    <motion.div
      className="mt-12 text-center px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Button asChild size="lg" variant="outline">
        <a href={ctaUrl}>{ctaText}</a>
      </Button>
    </motion.div>
  );
}
