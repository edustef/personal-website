"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

type ExpandContextType = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

const ExpandContext = createContext<ExpandContextType | undefined>(undefined);

export function PackageCardsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpandContext.Provider
      value={{
        isExpanded,
        toggleExpanded: () => setIsExpanded(!isExpanded),
      }}
    >
      {children}
    </ExpandContext.Provider>
  );
}

function useExpand() {
  const context = useContext(ExpandContext);
  if (!context) {
    throw new Error("useExpand must be used within PackageCardsProvider");
  }
  return context;
}

// Glow colors for pricing cards
const glowColors = [
  "217 91% 60%", // Blue
  "262 83% 58%", // Purple (popular)
  "142 71% 45%", // Green
];

type PackageCardProps = {
  pkg: string;
  isPopular: boolean;
  title: string;
  bestFor: string;
  description: string;
  features: string[];
  timeline: string;
  investment: string;
  whatsappUrl: string;
};

export function PackageCard({
  pkg,
  isPopular,
  title,
  bestFor,
  description,
  features,
  timeline,
  investment,
  whatsappUrl,
}: PackageCardProps) {
  const t = useTranslations("howIPrice");
  const { isExpanded, toggleExpanded } = useExpand();
  const INITIAL_FEATURES_COUNT = 3;
  const visibleFeatures = isExpanded
    ? features
    : features.slice(0, INITIAL_FEATURES_COUNT);
  const hasMoreFeatures = features.length > INITIAL_FEATURES_COUNT;

  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices (no hover capability)
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  // For mobile: trigger "hover" effects when card is centered in viewport
  const isInView = useInView(ref, { amount: 0.6 });
  const isActive = isHovered || (isTouchDevice && isInView);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Softer spring for smooth entrance
  const springConfig = { damping: 30, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [2.5, -2.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-2.5, 2.5]), springConfig);

  const glowX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  // Smooth scale on hover
  const scale = useSpring(isHovered ? 1.015 : 1, { damping: 25, stiffness: 100 });

  const cardIndex = pkg === "launch" ? 0 : pkg === "growth" ? 1 : 2;
  const glowColor = glowColors[cardIndex];

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
      className="group relative h-full"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
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
          scale,
        }}
      >
        {/* Popular badge - outside Card to avoid overflow clipping */}
        {isPopular && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-30"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium rounded-full shadow-lg whitespace-nowrap">
              {t("packages.mostPopular")}
            </div>
          </motion.div>
        )}

        <Card
          className={cn(
            "relative flex h-full flex-col rounded-2xl border-border/30 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden",
            "transition-all duration-500",
            isPopular && "border-primary/40",
            isActive && "shadow-2xl"
          )}
        >
          {/* Animated gradient border */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background: isPopular
                ? `linear-gradient(135deg, hsl(${glowColor}) 0%, hsl(${glowColor} / 0.3) 50%, hsl(${glowColor}) 100%)`
                : `linear-gradient(135deg, hsl(${glowColor} / 0.5) 0%, transparent 40%, transparent 60%, hsl(${glowColor} / 0.3) 100%)`,
              opacity: isActive ? 1 : isPopular ? 0.5 : 0,
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
                  `radial-gradient(400px circle at ${x}% ${y}%, hsl(${glowColor} / 0.1), transparent 50%)`
              ),
              opacity: isActive ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Shine sweep effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ x: "-100%" }}
              animate={isActive ? { x: "100%" } : { x: "-100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                transform: "skewX(-15deg)",
              }}
            />
          </motion.div>

          {/* Card content */}
          <div className="relative z-10 overflow-hidden rounded-2xl h-full flex flex-col">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-foreground mb-2 text-xl font-semibold text-balance">
                  {title}
                </h3>
                <p className="text-muted-foreground mb-3 text-sm text-pretty">
                  {bestFor}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  {description}
                </p>
              </div>

              <div className="mb-6 space-y-3">
                <p className="text-foreground text-sm font-medium">
                  {t("packages.whatYouGet")}:
                </p>
                <ul className="space-y-2">
                  {visibleFeatures.map((feature, index) => (
                    <motion.li
                      key={`${pkg}-${feature}`}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      </motion.div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {hasMoreFeatures && (
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleExpanded}
                    className="w-full group/btn"
                  >
                    {isExpanded ? (
                      <>
                        {t("packages.showLess")}
                        <motion.span
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <ChevronUp className="ml-2 h-4 w-4" />
                        </motion.span>
                      </>
                    ) : (
                      <>
                        {t("packages.showMore")}
                        <motion.span
                          animate={{ y: [0, 2, 0] }}
                          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </motion.span>
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="mt-auto border-t pt-6">
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Clock className="h-5 w-5" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">
                      {t("packages.timeline")}
                    </p>
                    <p className="text-foreground text-sm font-semibold">
                      {timeline}
                    </p>
                  </div>
                </div>
                <InteractiveButton href={whatsappUrl} isPopular={isPopular}>
                  {t("packages.getQuote")}
                </InteractiveButton>
              </div>
            </CardFooter>
          </div>

          {/* Popular card accent */}
          {isPopular && (
            <motion.div
              className="absolute bottom-0 left-4 right-4 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 0%, hsl(${glowColor}) 50%, transparent 100%)`,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Interactive CTA button with hover effects
type InteractiveButtonProps = {
  href: string;
  isPopular?: boolean;
  children: React.ReactNode;
};

function InteractiveButton({ href, isPopular, children }: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative inline-flex w-full items-center justify-center gap-2 overflow-hidden",
        "h-11 px-6 rounded-xl font-medium text-center",
        "transition-colors",
        isPopular
          ? "bg-primary text-primary-foreground"
          : "bg-primary text-primary-foreground"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect behind button */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: "0 0 30px -5px hsl(var(--primary))",
        }}
        animate={{
          opacity: isHovered ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%", opacity: 0 }}
        animate={
          isHovered
            ? { x: "100%", opacity: [0, 0.3, 0] }
            : { x: "-100%", opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "skewX(-20deg)",
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

// Add-on card mobile wrapper - same pattern as ProjectCard
type AddOnCardMobileProps = {
  children: React.ReactNode;
  index: number;
};

export function AddOnCardMobile({ children, index }: AddOnCardMobileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useInView(ref, { amount: 0.6 });

  const glowColors = ["198 93% 60%", "24 95% 53%", "339 90% 51%", "142 71% 45%"];
  const glowColor = glowColors[index % glowColors.length];

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
            "relative h-full w-full overflow-hidden rounded-xl border border-border/30",
            "bg-card/80 backdrop-blur-sm",
            "transition-all duration-500",
            isActive && "shadow-2xl border-border/50"
          )}
        >
          {/* Animated gradient border when in view */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl"
            style={{
              background: `linear-gradient(135deg, hsl(${glowColor} / 0.6) 0%, transparent 40%, transparent 60%, hsl(${glowColor} / 0.4) 100%)`,
            }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Inner background */}
          <div className="absolute inset-px rounded-[calc(0.75rem-1px)] bg-card" />

          {/* Center glow when in view */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(400px circle at 50% 50%, hsl(${glowColor} / 0.12), transparent 50%)`,
            }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shine sweep when entering view */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
            animate={{ opacity: isActive ? 1 : 0 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ x: isActive ? "100%" : "-100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                transform: "skewX(-15deg)",
              }}
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 h-full">{children}</div>

          {/* Subtle top highlight */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Add-on card wrapper with animations
type AddOnCardProps = {
  children: React.ReactNode;
  index: number;
};

export function AddOnCard({ children, index }: AddOnCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200 };
  const glowX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  const glowColors = ["198 93% 60%", "24 95% 53%", "339 90% 51%", "142 71% 45%"];
  const glowColor = glowColors[index % glowColors.length];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  return (
    <motion.div
      ref={ref}
      className="group relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      <motion.div
        className="relative h-full"
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow behind card */}
        <motion.div
          className="absolute inset-0 rounded-xl blur-xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, hsl(${glowColor} / 0.3), transparent 70%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative h-full">
          {/* Mouse-following highlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(300px circle at ${x}% ${y}%, hsl(${glowColor} / 0.1), transparent 50%)`
              ),
              opacity: isHovered ? 1 : 0,
            }}
          />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
