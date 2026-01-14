"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { cn } from "@/lib/utils";

type Metric = {
  value: string;
  labelKey: string;
};

type StatsSectionClientProps = {
  label: string;
  headline: string;
  subtitle: string;
  metrics: Metric[];
};

export function StatsSectionClient({
  label,
  headline,
  subtitle,
  metrics,
}: StatsSectionClientProps) {
  return (
    <section className="py-12 md:py-16">
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
            {headline}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {subtitle}
          </p>
        </AnimatedContainer>

        <div
          className={cn(
            "grid gap-4 md:gap-6",
            metrics.length === 4
              ? "grid-cols-2 md:grid-cols-4"
              : metrics.length === 5
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                : "grid-cols-2 md:grid-cols-3"
          )}
        >
          {metrics.map((metric, index) => (
            <AnimatedContainer
              key={`metric-${index}-${metric.value}`}
              trigger="scroll"
              fadeDirection="up"
              staggerIndex={index}
              staggerDelay={0.1}
            >
              <div className="text-center">
                <p className="text-primary text-3xl font-bold md:text-4xl mb-2">
                  {metric.value}
                </p>
                <p className="text-muted-foreground text-sm md:text-base">
                  {metric.labelKey}
                </p>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
