"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_CARD_PEEK = 24;

type ServicesGridMotionProps = {
  children: ReactNode;
};

export function ServicesGridMotion({ children }: ServicesGridMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-service-card]",
            root
          );
          const [firstCard, ...upcomingCards] = cards;

          if (!firstCard || upcomingCards.length === 0) return;

          gsap.set(cards, {
            zIndex: (index) => index + 1,
            transformOrigin: "center top",
            willChange: "transform",
          });
          gsap.set(root, { overflow: "hidden", position: "relative" });
          gsap.set(firstCard, { position: "relative", x: 0 });
          gsap.set(upcomingCards, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            x: () => root.clientWidth,
          });
          gsap.set(upcomingCards[0], {
            x: () => root.clientWidth - MOBILE_CARD_PEEK,
          });

          const timeline = gsap.timeline({
            defaults: { duration: 1, ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${root.offsetHeight * upcomingCards.length}`,
              pin: true,
              scrub: 0.4,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          for (const [index, card] of upcomingCards.entries()) {
            const previousCard = cards[index];
            const followingCard = upcomingCards[index + 1];

            timeline.to(previousCard, { scale: 0.975 }, index);
            timeline.to(card, { x: 0 }, index);

            if (followingCard) {
              timeline.set(
                followingCard,
                { x: () => root.clientWidth - MOBILE_CARD_PEEK },
                index + 0.9
              );
            }
          }
        }, root);

        return () => context.revert();
      }
    );

    media.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const artifacts = gsap.utils.toArray<HTMLElement>(
          "[data-service-artifact]",
          root
        );

        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });

          for (const [index, artifact] of artifacts.entries()) {
            const images = artifact.querySelectorAll("img");
            const direction = index % 2 === 0 ? -1 : 1;
            const at = index * 0.075;

            timeline.fromTo(
              artifact,
              { autoAlpha: 0.68, y: 16 },
              { autoAlpha: 1, y: 0, duration: 0.68 },
              at
            );
            timeline.fromTo(
              images,
              { scale: 1.055, x: direction * 8 },
              { scale: 1, x: 0, duration: 0.78 },
              at
            );
          }
        }, root);

        return () => context.revert();
      }
    );

    media.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const artifacts = gsap.utils.toArray<HTMLElement>(
          "[data-service-artifact]",
          root
        );
        const cleanups: Array<() => void> = [];

        for (const artifact of artifacts) {
          const images = Array.from(artifact.querySelectorAll("img"));
          const xSetters = images.map((image) =>
            gsap.quickTo(image, "x", { duration: 0.34, ease: "power3.out" })
          );
          const ySetters = images.map((image) =>
            gsap.quickTo(image, "y", { duration: 0.34, ease: "power3.out" })
          );

          const handlePointerMove = (event: PointerEvent) => {
            const bounds = artifact.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            for (const setX of xSetters) setX(x * 10);
            for (const setY of ySetters) setY(y * 8);
          };

          const handlePointerLeave = () => {
            for (const setX of xSetters) setX(0);
            for (const setY of ySetters) setY(0);
          };

          artifact.addEventListener("pointermove", handlePointerMove);
          artifact.addEventListener("pointerleave", handlePointerLeave);

          cleanups.push(() => {
            artifact.removeEventListener("pointermove", handlePointerMove);
            artifact.removeEventListener("pointerleave", handlePointerLeave);
          });
        }

        return () => {
          for (const cleanup of cleanups) cleanup();
        };
      }
    );

    return () => media.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="mt-8 grid overflow-hidden border-foreground/18 border-t md:border-l xl:grid-cols-12"
    >
      {children}
    </div>
  );
}
