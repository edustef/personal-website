"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Spline = dynamic(
  () =>
    import("@splinetool/react-spline").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

type HeroSplineProps = {
  className?: string;
};

export function HeroSpline({ className }: HeroSplineProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grayscale invert dark:invert-0 animate-in fade-in absolute inset-0 -z-10 h-[calc(100vh)] w-full overflow-hidden duration-2000",
        className
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
