"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import type React from "react";

interface TimelineData {
  id?: string;
  title: string;
  content: React.ReactNode;
}
interface Props {
  label: string;
  headline: string;
  subtitle: string;
  timelineData: TimelineData[];
  cta?: string;
  ctaUrl?: string;
}

export function HowIWorkSectionClient({
  label,
  headline,
  subtitle,
  timelineData,
  cta,
  ctaUrl,
}: Props) {
  return (
    <section
      id="how-i-work"
      className="dark-instrument scroll-mt-16 py-24 md:py-32"
    >
      <div className="editorial-shell">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-8">
            <p className="editorial-label text-white/55">03 / {label}</p>
            <h2 className="editorial-display mt-5 text-5xl text-[#f4f0e7] sm:text-6xl lg:text-8xl">
              {headline}
            </h2>
          </div>
          <p className="max-w-md text-white/62 leading-relaxed lg:col-span-4 lg:pb-2">
            {subtitle}
          </p>
        </AnimatedContainer>

        <div className="relative mt-20 grid gap-0 border-white/25 border-t md:grid-cols-2 lg:grid-cols-4">
          {timelineData.map((item, index) => (
            <AnimatedContainer
              key={item.id ?? item.title}
              trigger="scroll"
              fadeDirection="up"
              staggerIndex={index}
              className="group relative border-white/20 border-b px-0 py-8 md:px-7 lg:border-r"
            >
              <div className="absolute -top-2 left-0 size-4 rounded-full border border-[#c9b9a9] bg-[#121210] transition-colors group-hover:border-primary group-hover:bg-primary md:left-7" />
              <p className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-2xl font-normal leading-tight text-[#f4f0e7]">
                {item.title}
              </h3>
              <div className="mt-6 max-h-52 overflow-hidden text-sm [&_.text-foreground]:!text-white/62 [&_li]:!gap-2 [&_p]:!text-white/62 [&_svg]:!size-4">
                {item.content}
              </div>
            </AnimatedContainer>
          ))}
        </div>

        {cta && ctaUrl ? (
          <div className="mt-10 flex justify-end">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-white/45 border-b pb-1 text-sm text-white hover:border-primary hover:text-primary"
            >
              {cta} ↗
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
