"use client";

import { AnimatedBlob } from "@/components/ui/animated-blob";

type BlobsLayerProps = {
  isVisible: boolean;
};

export function BlobsLayer({ isVisible }: BlobsLayerProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-left blob */}
      <AnimatedBlob
        className="-top-20 -left-20 md:-top-32 md:-left-32"
        size={280}
        gradient="linear-gradient(135deg, var(--navy-400), var(--navy-200))"
        delay={0}
        isVisible={isVisible}
      />
      {/* Bottom-right blob */}
      <AnimatedBlob
        className="-bottom-24 -right-24 md:-bottom-40 md:-right-40"
        size={320}
        gradient="linear-gradient(225deg, var(--navy-500), var(--navy-300))"
        delay={0.1}
        isVisible={isVisible}
      />
      {/* Center blob - desktop only */}
      <AnimatedBlob
        className="hidden lg:block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        size={200}
        gradient="linear-gradient(180deg, var(--navy-300), var(--navy-200))"
        delay={0.2}
        isVisible={isVisible}
      />
    </div>
  );
}
