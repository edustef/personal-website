# Services Section Interactivity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add animated blobs, organic tendrils, and icon-derived shapes to the services section with orchestrated scroll-triggered reveals and mobile carousel trail effects.

**Architecture:** Client-side wrapper component handles all animations via Framer Motion and native IntersectionObserver. Server component passes data; client component orchestrates three visual layers (blobs, tendrils, icon shapes) with coordinated reveal sequence.

**Tech Stack:** React 19, Framer Motion, Embla Carousel (existing), SVG for tendrils, CSS for blobs

---

### Task 1: Create AnimatedBlob Component

**Files:**
- Create: `components/ui/animated-blob.tsx`

**Step 1: Create the blob component**

```tsx
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
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors related to animated-blob.tsx

**Step 3: Commit**

```bash
git add components/ui/animated-blob.tsx
git commit -m "feat(services): add AnimatedBlob component"
```

---

### Task 2: Create AnimatedTendril Component

**Files:**
- Create: `components/ui/animated-tendril.tsx`

**Step 1: Create the tendril SVG component**

```tsx
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
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors related to animated-tendril.tsx

**Step 3: Commit**

```bash
git add components/ui/animated-tendril.tsx
git commit -m "feat(services): add AnimatedTendril SVG component"
```

---

### Task 3: Create FloatingIconShapes Component

**Files:**
- Create: `components/ui/floating-icon-shapes.tsx`

**Step 1: Create icon shapes with per-icon mapping**

```tsx
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
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors related to floating-icon-shapes.tsx

**Step 3: Commit**

```bash
git add components/ui/floating-icon-shapes.tsx
git commit -m "feat(services): add FloatingIconShapes component with icon mapping"
```

---

### Task 4: Create BlobsLayer Component

**Files:**
- Create: `components/sections/services/blobs-layer.tsx`

**Step 1: Create the blobs layer with positioned blobs**

```tsx
"use client";

import { AnimatedBlob } from "@/components/ui/animated-blob";

type BlobsLayerProps = {
  isVisible: boolean;
};

export function BlobsLayer({ isVisible }: BlobsLayerProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-left blob */}
      <AnimatedBlob
        className="-top-20 -left-20 md:-top-32 md:-left-32"
        size={280}
        gradient="linear-gradient(135deg, var(--navy-400), var(--navy-200))"
        delay={0}
        isVisible={isVisible}
      />
      {/* Bottom-right blob */}
      <AnimatedBlob
        className="-bottom-24 -right-24 md:-bottom-40 md:-right-40"
        size={320}
        gradient="linear-gradient(225deg, var(--navy-500), var(--navy-300))"
        delay={0.1}
        isVisible={isVisible}
      />
      {/* Center blob - desktop only */}
      <AnimatedBlob
        className="hidden lg:block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        size={200}
        gradient="linear-gradient(180deg, var(--navy-300), var(--navy-200))"
        delay={0.2}
        isVisible={isVisible}
      />
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add components/sections/services/blobs-layer.tsx
git commit -m "feat(services): add BlobsLayer with positioned blobs"
```

---

### Task 5: Create TendrilsLayer Component

**Files:**
- Create: `components/sections/services/tendrils-layer.tsx`

**Step 1: Create tendrils layer with organic curved paths**

```tsx
"use client";

import { AnimatedTendril } from "@/components/ui/animated-tendril";

type TendrilsLayerProps = {
  isVisible: boolean;
};

// Organic curved paths that weave through the section
const tendrilPaths = [
  // Top-left to center-right sweep
  "M -50 100 Q 150 50, 300 150 T 600 120 T 900 180",
  // Bottom curve
  "M -30 350 Q 200 400, 400 320 T 700 380 T 950 300",
  // Middle diagonal
  "M 100 -20 Q 250 180, 450 200 T 750 150",
];

export function TendrilsLayer({ isVisible }: TendrilsLayerProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {tendrilPaths.map((path, index) => (
        <AnimatedTendril
          key={index}
          path={path}
          delay={0.2 + index * 0.2}
          isVisible={isVisible}
        />
      ))}
    </svg>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add components/sections/services/tendrils-layer.tsx
git commit -m "feat(services): add TendrilsLayer with organic curved paths"
```

---

### Task 6: Create MobileTendrilsLayer Component

**Files:**
- Create: `components/sections/services/mobile-tendrils-layer.tsx`

**Step 1: Create mobile-specific tendrils with scroll progress integration**

```tsx
"use client";

import { AnimatedTendril } from "@/components/ui/animated-tendril";
import { useCarousel } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

type MobileTendrilsLayerProps = {
  isVisible: boolean;
  cardCount: number;
};

export function MobileTendrilsLayer({ isVisible, cardCount }: MobileTendrilsLayerProps) {
  const { api, selectedIndex } = useCarousel();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onScroll = () => {
      const progress = api.scrollProgress();
      setScrollProgress(progress);
    };

    api.on("scroll", onScroll);
    return () => {
      api.off("scroll", onScroll);
    };
  }, [api]);

  // Generate connecting paths between cards
  const generatePath = (index: number) => {
    const startX = 50 + (index * 300);
    const endX = startX + 300;
    const midY = 150 + Math.sin(index * 0.8) * 30;
    return `M ${startX} 120 Q ${startX + 150} ${midY}, ${endX} 120`;
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ width: `${cardCount * 85}%` }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: cardCount - 1 }).map((_, index) => {
        const isActive = index === selectedIndex || index === selectedIndex - 1;
        const glowIntensity = isActive ? 0.5 + Math.abs(scrollProgress - index / (cardCount - 1)) * 0.5 : 0;

        return (
          <AnimatedTendril
            key={index}
            path={generatePath(index)}
            delay={0.3 + index * 0.1}
            isVisible={isVisible}
            glowIntensity={glowIntensity}
          />
        );
      })}
    </svg>
  );
}
```

**Step 2: Export useCarousel from carousel.tsx**

Modify `components/ui/carousel.tsx` - add `useCarousel` to exports at line 278:

```tsx
export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
};
```

**Step 3: Verify component compiles**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add components/sections/services/mobile-tendrils-layer.tsx components/ui/carousel.tsx
git commit -m "feat(services): add MobileTendrilsLayer with scroll progress trail effect"
```

---

### Task 7: Create ServicesSectionClient Wrapper

**Files:**
- Create: `components/sections/services/services-section-client.tsx`

**Step 1: Create the client wrapper with intersection observer**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BlobsLayer } from "./blobs-layer";
import { TendrilsLayer } from "./tendrils-layer";

type ServicesSectionClientProps = {
  children: React.ReactNode;
};

export function ServicesSectionClient({ children }: ServicesSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      <BlobsLayer isVisible={isVisible} />
      <TendrilsLayer isVisible={isVisible} />
      {children}
    </div>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add components/sections/services/services-section-client.tsx
git commit -m "feat(services): add ServicesSectionClient wrapper with intersection observer"
```

---

### Task 8: Create ServiceCard Client Component

**Files:**
- Create: `components/sections/services/service-card.tsx`

**Step 1: Create service card with floating icon shapes**

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BGPattern } from "@/components/ui/bg-pattern";
import { FloatingIconShapes } from "@/components/ui/floating-icon-shapes";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  icon: string;
  IconComponent: LucideIcon;
  title: string;
  description: string;
  patternVariant: "dots" | "diagonal-stripes" | "grid";
  isVisible: boolean;
  delay: number;
  featured?: boolean;
};

export function ServiceCard({
  icon,
  IconComponent,
  title,
  description,
  patternVariant,
  isVisible,
  delay,
  featured = false,
}: ServiceCardProps) {
  return (
    <Card className="isolate relative h-full w-full overflow-hidden rounded-2xl border-muted bg-background/50 backdrop-blur-sm">
      <BGPattern
        variant={patternVariant}
        mask="fade-edges"
        size={featured ? 24 : 20}
        opacity={0.25}
      />

      {/* Floating icon shapes */}
      <FloatingIconShapes
        icon={icon}
        className="top-4 right-4"
        delay={delay}
        isVisible={isVisible}
      />
      <FloatingIconShapes
        icon={icon}
        className="bottom-6 left-6"
        delay={delay + 0.1}
        isVisible={isVisible}
      />

      <CardContent className={cn("relative", featured ? "p-8" : "p-6")}>
        <IconComponent className={cn("mb-4", featured ? "size-10" : "size-8")} />
        <h3 className={cn(
          "text-foreground mb-2 break-words font-semibold text-balance",
          featured ? "mb-3 text-xl" : "text-xl md:text-base"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-muted-foreground break-words leading-relaxed text-pretty",
          featured ? "text-lg" : "text-lg"
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add components/sections/services/service-card.tsx
git commit -m "feat(services): add ServiceCard component with floating icon shapes"
```

---

### Task 9: Create index barrel export

**Files:**
- Create: `components/sections/services/index.ts`

**Step 1: Create barrel export**

```ts
export { ServicesSectionClient } from "./services-section-client";
export { ServiceCard } from "./service-card";
export { BlobsLayer } from "./blobs-layer";
export { TendrilsLayer } from "./tendrils-layer";
export { MobileTendrilsLayer } from "./mobile-tendrils-layer";
```

**Step 2: Commit**

```bash
git add components/sections/services/index.ts
git commit -m "feat(services): add barrel export for services components"
```

---

### Task 10: Refactor services-section.tsx to use client components

**Files:**
- Modify: `components/sections/services-section.tsx`

**Step 1: Update imports and wrap with client components**

Replace the entire file with:

```tsx
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { type Service, services } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import { Globe, Headphones, Layers, Palette, Rocket, Zap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ServicesSectionClient, ServiceCard } from "./services";
import { ServicesSectionMobileCarousel } from "./services/services-section-mobile";

const iconMap: Record<string, React.ElementType> = {
  layers: Layers,
  zap: Zap,
  rocket: Rocket,
  palette: Palette,
  headphones: Headphones,
  globe: Globe,
};

const patternVariants: Array<"dots" | "diagonal-stripes" | "grid"> = [
  "diagonal-stripes",
  "dots",
  "grid",
];

function getPatternForService(
  index: number
): "dots" | "diagonal-stripes" | "grid" {
  const patternIndex = index % patternVariants.length;
  return patternVariants[patternIndex];
}

type ServicesSectionProps = {
  services?: Service[];
};

export default async function ServicesSection({
  services: servicesProp,
}: ServicesSectionProps) {
  const servicesToDisplay = servicesProp || services;
  if (!servicesToDisplay || servicesToDisplay.length === 0) {
    return null;
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "services" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const featuredServices = servicesToDisplay.filter((s) => s.featured);
  const otherServices = servicesToDisplay.filter((s) => !s.featured);

  const headerT = await getTranslations({
    locale,
    namespace: "settings.header",
  });
  const servicesSlug = headerT("nav.servicesSlug");

  const phone = profileT("phone");
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
    : "https://wa.me/40775378525";

  // Pre-translate all services for client components
  const translatedServices = servicesToDisplay.map((service, index) => ({
    ...service,
    title: t(service.titleKey),
    description: t(service.descriptionKey),
    patternVariant: getPatternForService(index),
    IconComponent: iconMap[service.icon] || Layers,
    featured: service.featured,
  }));

  const translatedFeatured = translatedServices.filter((s) => s.featured);
  const translatedOther = translatedServices.filter((s) => !s.featured);

  return (
    <section
      id={servicesSlug}
      className="scroll-mt-12 overflow-x-hidden py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl md:px-6">
        <ServicesSectionClient>
          {/* Header */}
          <div className="mb-12 md:mb-16 text-center px-4">
            <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
              {t("label")}
            </p>
            <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl text-balance">
              <a
                href={`#${servicesSlug}`}
                className="hover:text-primary transition-colors"
              >
                {t("headline")}
              </a>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
              {t("subtitle")}
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {translatedFeatured.map((service, index) => (
              <div
                key={service._id}
                className={cn("min-w-0 lg:col-span-2 lg:row-span-2 text-lg")}
              >
                <ServiceCard
                  icon={service.icon}
                  IconComponent={service.IconComponent}
                  title={service.title}
                  description={service.description}
                  patternVariant={service.patternVariant}
                  isVisible={true}
                  delay={0.6 + index * 0.1}
                  featured
                />
              </div>
            ))}

            {translatedOther.map((service, index) => (
              <div key={service._id} className="min-w-0">
                <ServiceCard
                  icon={service.icon}
                  IconComponent={service.IconComponent}
                  title={service.title}
                  description={service.description}
                  patternVariant={service.patternVariant}
                  isVisible={true}
                  delay={0.6 + (translatedFeatured.length + index) * 0.1}
                />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <ServicesSectionMobileCarousel
            services={translatedServices}
            headline={t("headline")}
          />

          {/* Section CTA */}
          <div className="mt-12 text-center px-4">
            <Button asChild size="lg" variant="outline">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t("cta")}
              </a>
            </Button>
          </div>
        </ServicesSectionClient>
      </div>
    </section>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run type-check`
Expected: Will fail because ServicesSectionMobileCarousel doesn't exist yet

**Step 3: Continue to next task**

---

### Task 11: Create ServicesSectionMobileCarousel Component

**Files:**
- Create: `components/sections/services/services-section-mobile.tsx`

**Step 1: Create mobile carousel with tendrils**

```tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ServiceCard } from "./service-card";
import { MobileTendrilsLayer } from "./mobile-tendrils-layer";
import { useEffect, useRef, useState } from "react";

type TranslatedService = {
  _id: string;
  icon: string;
  title: string;
  description: string;
  patternVariant: "dots" | "diagonal-stripes" | "grid";
  IconComponent: LucideIcon;
  featured: boolean;
};

type ServicesSectionMobileCarouselProps = {
  services: TranslatedService[];
  headline: string;
};

export function ServicesSectionMobileCarousel({
  services,
  headline,
}: ServicesSectionMobileCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="md:hidden relative">
      <Carousel className="w-full" aria-label={headline}>
        <div className="relative">
          <MobileTendrilsLayer isVisible={isVisible} cardCount={services.length} />
          <CarouselContent className="-ml-4 px-4 pb-4">
            {services.map((service, index) => (
              <CarouselItem
                key={service._id}
                className={cn(
                  "pl-4 basis-[85%]",
                  index === services.length - 1 && "mr-4"
                )}
              >
                <div className="h-full">
                  <ServiceCard
                    icon={service.icon}
                    IconComponent={service.IconComponent}
                    title={service.title}
                    description={service.description}
                    patternVariant={service.patternVariant}
                    isVisible={isVisible}
                    delay={0.3 + index * 0.1}
                    featured={service.featured}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <div className="mt-6">
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  );
}
```

**Step 2: Update barrel export**

Add to `components/sections/services/index.ts`:

```ts
export { ServicesSectionMobileCarousel } from "./services-section-mobile";
```

**Step 3: Verify everything compiles**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add components/sections/services/services-section-mobile.tsx components/sections/services/index.ts
git commit -m "feat(services): add mobile carousel with tendrils trail effect"
```

---

### Task 12: Update ServicesSectionClient to Pass Visibility to Children

**Files:**
- Modify: `components/sections/services/services-section-client.tsx`

**Step 1: Use React context to pass visibility state**

Replace the entire file:

```tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { BlobsLayer } from "./blobs-layer";
import { TendrilsLayer } from "./tendrils-layer";

type ServicesVisibilityContextType = {
  isVisible: boolean;
};

const ServicesVisibilityContext = createContext<ServicesVisibilityContextType>({
  isVisible: false,
});

export function useServicesVisibility() {
  return useContext(ServicesVisibilityContext);
}

type ServicesSectionClientProps = {
  children: React.ReactNode;
};

export function ServicesSectionClient({ children }: ServicesSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <ServicesVisibilityContext.Provider value={{ isVisible }}>
      <div ref={sectionRef} className="relative">
        <BlobsLayer isVisible={isVisible} />
        <div className="hidden md:block">
          <TendrilsLayer isVisible={isVisible} />
        </div>
        {children}
      </div>
    </ServicesVisibilityContext.Provider>
  );
}
```

**Step 2: Update barrel export to include hook**

Update `components/sections/services/index.ts`:

```ts
export { ServicesSectionClient, useServicesVisibility } from "./services-section-client";
export { ServiceCard } from "./service-card";
export { BlobsLayer } from "./blobs-layer";
export { TendrilsLayer } from "./tendrils-layer";
export { MobileTendrilsLayer } from "./mobile-tendrils-layer";
export { ServicesSectionMobileCarousel } from "./services-section-mobile";
```

**Step 3: Update ServiceCard to use context**

Modify `components/sections/services/service-card.tsx` to optionally use context:

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BGPattern } from "@/components/ui/bg-pattern";
import { FloatingIconShapes } from "@/components/ui/floating-icon-shapes";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useServicesVisibility } from "./services-section-client";

type ServiceCardProps = {
  icon: string;
  IconComponent: LucideIcon;
  title: string;
  description: string;
  patternVariant: "dots" | "diagonal-stripes" | "grid";
  isVisible?: boolean;
  delay: number;
  featured?: boolean;
};

export function ServiceCard({
  icon,
  IconComponent,
  title,
  description,
  patternVariant,
  isVisible: isVisibleProp,
  delay,
  featured = false,
}: ServiceCardProps) {
  const { isVisible: contextVisible } = useServicesVisibility();
  const isVisible = isVisibleProp ?? contextVisible;

  return (
    <Card className="isolate relative h-full w-full overflow-hidden rounded-2xl border-muted bg-background/50 backdrop-blur-sm">
      <BGPattern
        variant={patternVariant}
        mask="fade-edges"
        size={featured ? 24 : 20}
        opacity={0.25}
      />

      {/* Floating icon shapes */}
      <FloatingIconShapes
        icon={icon}
        className="top-4 right-4"
        delay={delay}
        isVisible={isVisible}
      />
      <FloatingIconShapes
        icon={icon}
        className="bottom-6 left-6"
        delay={delay + 0.1}
        isVisible={isVisible}
      />

      <CardContent className={cn("relative", featured ? "p-8" : "p-6")}>
        <IconComponent className={cn("mb-4", featured ? "size-10" : "size-8")} />
        <h3 className={cn(
          "text-foreground mb-2 break-words font-semibold text-balance",
          featured ? "mb-3 text-xl" : "text-xl md:text-base"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-muted-foreground break-words leading-relaxed text-pretty",
          featured ? "text-lg" : "text-lg"
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Verify everything compiles**

Run: `npm run type-check`
Expected: No errors

**Step 5: Commit**

```bash
git add components/sections/services/
git commit -m "feat(services): add visibility context for coordinated animations"
```

---

### Task 13: Final Integration and Testing

**Step 1: Run the dev server**

Run: `npm run dev`
Expected: Server starts without errors

**Step 2: Manual verification checklist**

- [ ] Navigate to services section
- [ ] Verify blobs fade in when section is 30% visible
- [ ] Verify tendrils draw themselves after blobs
- [ ] Verify floating icon shapes appear near each card
- [ ] Verify idle animations continue (blob drift, shape orbit)
- [ ] On mobile: verify carousel tendrils glow when swiping
- [ ] Check dark mode appearance

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(services): complete interactive services section with animations

- Add animated blobs with gradient fills and idle drift
- Add self-drawing organic tendrils with SVG path animation
- Add floating icon-derived shapes per service card
- Implement orchestrated reveal on scroll (70% threshold)
- Add mobile carousel trail effect with glow on swipe
- Use intersection observer for performance"
```

---

## Summary

This plan creates:
- 4 new UI components (`animated-blob`, `animated-tendril`, `floating-icon-shapes`, `carousel` export update)
- 5 new services-specific components (`blobs-layer`, `tendrils-layer`, `mobile-tendrils-layer`, `services-section-client`, `services-section-mobile`)
- 1 refactored component (`services-section.tsx`)

Total: ~13 commits for incremental, reviewable progress.
