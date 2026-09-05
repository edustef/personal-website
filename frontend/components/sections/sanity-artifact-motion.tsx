"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const enterOffsets = [
  { x: -10, y: 12 },
  { x: 12, y: 9 },
  { x: -6, y: 14 },
];

const leaveOffsets = [
  { x: 7, y: -7 },
  { x: -7, y: -5 },
  { x: 5, y: -8 },
];

export function SanityArtifactMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const layers = gsap.utils.toArray<HTMLElement>(
          "[data-sanity-artifact-layer]",
          root
        );

        gsap.fromTo(
          layers,
          {
            x: (index) => (enterOffsets[index] ?? enterOffsets[0]).x,
            y: (index) => (enterOffsets[index] ?? enterOffsets[0]).y,
            opacity: 0.94,
          },
          {
            x: (index) => (leaveOffsets[index] ?? leaveOffsets[0]).x,
            y: (index) => (leaveOffsets[index] ?? leaveOffsets[0]).y,
            opacity: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        for (const [index, layer] of layers.entries()) {
          gsap.to(layer, {
            rotation: `+=${index % 2 === 0 ? 0.32 : -0.28}`,
            duration: 3.2 + index * 0.45,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      }, root);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-label="Illustrative content model, Sanity Studio workspace, and published page"
      className="group/artifacts relative mx-auto aspect-[1.08/1] w-full max-w-[43rem]"
      role="img"
    >
      {children}
    </div>
  );
}
