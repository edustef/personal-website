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
