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
