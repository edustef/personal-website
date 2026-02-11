"use client";

import { cn } from "@/lib/utils";
import { AnimatedContainer } from "./animated-container";

type SectionHeaderProps = {
  label: string;
  headline: string;
  subtitle: string;
  anchorSlug?: string;
  className?: string;
};

export function SectionHeader({
  label,
  headline,
  subtitle,
  anchorSlug,
  className,
}: SectionHeaderProps) {
  return (
    <AnimatedContainer
      trigger="scroll"
      fadeDirection="up"
      className={cn("mb-12 md:mb-16 text-center px-4", className)}
    >
      <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
        {label}
      </p>
      <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl text-balance">
        {anchorSlug ? (
          <a
            href={`#${anchorSlug}`}
            className="hover:text-primary transition-colors"
          >
            {headline}
          </a>
        ) : (
          headline
        )}
      </h2>
      <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
        {subtitle}
      </p>
    </AnimatedContainer>
  );
}
