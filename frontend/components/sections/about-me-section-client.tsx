"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion, useScroll, useTransform } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

type AboutMeSectionClientProps = {
  label: string;
  headline: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
};

export function AboutMeSectionClient({
  label,
  headline,
  subtitle,
  description,
  image,
}: AboutMeSectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="about-me"
      className="scroll-mt-24 relative py-12 md:py-16"
      ref={sectionRef}
    >
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
            <a
              href="#about-me"
              className="hover:text-primary transition-colors"
            >
              {headline}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {subtitle}
          </p>
        </AnimatedContainer>
        <div className="flex flex-col items-center lg:gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="shrink-0 overflow-hidden">
            <AnimatedContainer
              trigger="scroll"
              fadeDirection="left"
            >
              <motion.div style={{ y: imageY }}>
                <div
                  style={{
                    maskImage:
                      "radial-gradient(60% 80% at top, black 20%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(70% 90% at top, black 20%, transparent 100%)",
                  }}
                >
                  <Image
                    src={image}
                    alt="About me"
                    className="w-full max-w-[400px] aspect-3/4 object-cover object-top md:max-w-[500px] h-auto grayscale-100 contrast-120"
                  />
                </div>
              </motion.div>
            </AnimatedContainer>
          </div>
          <AnimatedContainer
            trigger="scroll"
            fadeDirection="right"
            delay={0.2}
            className="flex-1 text-left"
          >
            <p className="lg:mt-24 text-muted-foreground text-lg leading-relaxed text-pretty">
              {description}
            </p>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
