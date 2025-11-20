"use client";

import Spline from "@splinetool/react-spline";

import { cn } from "@/lib/utils";

type HeroSplineProps = {
  className?: string;
};

export function HeroSpline({ className }: HeroSplineProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in absolute inset-0 -z-10 overflow-hidden duration-2000",
        className,
      )}
    >
      <Spline
        scene="https://prod.spline.design/MJetX09Vu4tNZxlW/scene.splinecode"
        style={{ width: "100%", height: "108%" }}
      />
    </div>
  );
}
