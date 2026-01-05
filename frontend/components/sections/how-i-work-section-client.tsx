"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";

import { Timeline } from "@/components/ui/timeline";
import type React from "react";

interface TimelineData {
  id?: string;
  title: string;
  content: React.ReactNode;
}

interface HowIWorkSectionClientProps {
  label: string;
  headline: string;
  subtitle: string;
  timelineData: TimelineData[];
}

export function HowIWorkSectionClient({
  label,
  headline,
  subtitle,
  timelineData,
}: HowIWorkSectionClientProps) {
  return (
    <section id="how-i-work" className="scroll-mt-24 relative py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-16 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {label}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl text-balance">
            <a
              href="#how-i-work"
              className="hover:text-primary transition-colors"
            >
              {headline}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {subtitle}
          </p>
        </AnimatedContainer>

        <div className="relative w-full">
          <Timeline data={timelineData} showHeader={false} />
        </div>
      </div>
    </section>
  );
}
