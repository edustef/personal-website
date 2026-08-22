"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion, useScroll, useTransform } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

type Props = {
  label: string;
  headline: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
  cta?: string;
  ctaUrl?: string;
};

export function AboutMeSectionClient({
  label,
  headline,
  subtitle,
  description,
  image,
  cta,
  ctaUrl,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [36, -36]);

  return (
    <section
      id="about-me"
      ref={sectionRef}
      className="scroll-mt-16 overflow-hidden bg-[#a96f52] text-[#171714]"
    >
      <div className="editorial-shell grid min-h-[46rem] lg:grid-cols-12">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="left"
          className="relative z-10 flex flex-col justify-center py-24 lg:col-span-6 lg:py-32"
        >
          <p className="editorial-label">{label}</p>
          <h2 className="editorial-display mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-8xl">
            {headline}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/62">
            {subtitle}
          </p>
          <p className="mt-10 max-w-xl border-black/30 border-t pt-6 text-lg leading-relaxed text-black/75">
            {description}
          </p>
          {cta && ctaUrl ? (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-fit border-black/60 border-b pb-1 font-medium hover:border-primary"
            >
              {cta} ↗
            </a>
          ) : null}
        </AnimatedContainer>

        <div className="relative min-h-[32rem] lg:col-span-6 lg:min-h-full">
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-x-0 bottom-[-5rem] flex justify-center lg:inset-y-0 lg:right-[-8rem] lg:left-[-8rem] lg:items-end"
          >
            <Image
              src={image}
              alt="Eduard Stefan"
              priority={false}
              className="h-auto max-h-[34rem] w-auto max-w-full object-contain grayscale contrast-125 mix-blend-multiply lg:max-h-[52rem] lg:max-w-none"
            />
          </motion.div>
          <div className="absolute right-4 bottom-10 rotate-[-4deg] font-mono text-xs leading-loose text-black/60 md:right-12">
            design ↔ code
            <br />
            content ↔ delivery
          </div>
        </div>
      </div>
    </section>
  );
}
