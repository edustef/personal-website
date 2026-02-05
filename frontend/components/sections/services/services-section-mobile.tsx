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
