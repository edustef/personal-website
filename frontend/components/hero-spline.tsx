"use client";

import Spline from "@splinetool/react-spline";

import { cn } from "@/lib/utils";

type HeroSplineProps = {
  className?: string;
};

export function HeroSpline({ className }: HeroSplineProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-in fade-in absolute inset-0 -z-10 h-[calc(100vh)] w-full overflow-hidden duration-2000",
        className,
      )}
    >
      <Spline
        aria-hidden="true"
        tabIndex={-1}
        scene="https://prod.spline.design/MJetX09Vu4tNZxlW/scene.splinecode"
        style={{ width: "100%", height: "108%" }}
      />
    </div>
  );
}
