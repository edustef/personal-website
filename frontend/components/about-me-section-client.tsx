"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type AboutMeSectionClientProps = {
  label: string;
  headline: string;
  subtitle: string;
  description: string;
  imageSrc: string;
};

export function AboutMeSectionClient({
  label,
  headline,
  subtitle,
  description,
  imageSrc,
}: AboutMeSectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about-me" className="py-12 md:py-16" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-16 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {label}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            <a
              href="#about-me"
              className="hover:text-primary transition-colors"
            >
              {headline}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {subtitle}
          </p>
        </AnimatedContainer>
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          <motion.div className="shrink-0" style={{ y: imageY }}>
            <div
              style={{
                maskImage:
                  "radial-gradient(110% 105% at right top, black 50%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(110% 105% at right top, black 50%, transparent 100%)",
              }}
            >
              <Image src={imageSrc} width={400} height={600} alt="About me" />
            </div>
          </motion.div>
          <AnimatedContainer
            trigger="scroll"
            fadeDirection="right"
            delay={0.2}
            className="flex-1 text-left"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
