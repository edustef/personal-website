"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

type Props = {
  label: string;
  headline: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  cta?: string;
  ctaUrl?: string;
};

export function AboutMeSectionClient({
  label,
  headline,
  description,
  image,
  imageAlt,
  cta,
  ctaUrl,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section
      id="about-me"
      ref={sectionRef}
      className="dark-instrument editorial-surface-raised relative scroll-mt-16 overflow-hidden border-[var(--section-rule)] border-t"
    >
      <div className="editorial-shell grid lg:min-h-[52rem] lg:grid-cols-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col justify-center py-20 sm:py-24 lg:col-span-6 lg:py-32 lg:pr-12 xl:pr-20"
        >
          <p className="editorial-label editorial-section-label">{label}</p>
          <h2 className="editorial-section-title mt-6 max-w-[12.5ch]">
            {headline}
          </h2>

          <p className="editorial-section-copy mt-10 max-w-[34rem] border-[var(--section-rule)] border-t pt-7">
            {description}
          </p>

          {cta && ctaUrl ? (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-text-link group mt-9"
            >
              <span>{cta}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
              />
            </a>
          ) : null}
        </motion.div>

        <div className="relative min-h-[34rem] sm:min-h-[42rem] lg:col-span-6 lg:min-h-full">
          <motion.div
            style={shouldReduceMotion ? undefined : { y: imageY }}
            className="absolute inset-x-[-3.25rem] top-3 bottom-[-13.5rem] flex items-start justify-center sm:inset-x-[-1.5rem] sm:top-4 sm:bottom-[-17rem] lg:inset-x-[-8rem] lg:top-8 lg:bottom-[-30rem] lg:justify-end xl:right-[-10rem] xl:left-[-5rem]"
          >
            <Image
              src={image}
              alt={imageAlt}
              sizes="(max-width: 1023px) 125vw, 62vw"
              className="h-full w-auto max-w-none object-contain object-top grayscale sepia-[0.18] contrast-[1.14] brightness-[0.82]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
