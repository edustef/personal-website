"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PaintRollerIcon } from "lucide-react";

type HeroIntroProps = {
  headline?: string | null;
  tagline?: string | null;
  renovationLabelPrimary?: string | null;
  renovationLabelSecondary?: string | null;
  findMeOnLabel?: string | null;
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

export function HeroIntro({
  headline,
  tagline,
  renovationLabelPrimary,
  renovationLabelSecondary,
  findMeOnLabel,
}: HeroIntroProps) {
  const links = [
    {
      href: "https://www.linkedin.com/in/eduard-stefan-089371100/",
      label: "LinkedIn",
    },
    { href: "https://github.com/edustef", label: "GitHub" },
    { href: "https://www.instagram.com/eduardstefan/", label: "Instagram" },
  ];

  if (!headline) {
    return null;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between gap-8 md:justify-start">
      <motion.div
        className="flex flex-col gap-4 mix-blend-difference"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-secondary/30 text-secondary-foreground relative w-fit rounded-lg px-4 py-2">
          <div className="mx-auto flex max-w-6xl flex-row items-center gap-2">
            <PaintRollerIcon className="size-5" />
            <div className="flex flex-row items-center text-sm uppercase">
              <span className="font-bold tracking-widest uppercase">
                {renovationLabelPrimary || "Under"}
              </span>
              <span className="ml-0.5 tracking-tight">
                {renovationLabelSecondary || "Renovation"}
              </span>
            </div>
          </div>
        </div>
        <h1 className="text-foreground max-w-2xl text-4xl leading-normal font-semibold text-pretty md:text-6xl md:leading-tight">
          {headline}
        </h1>
      </motion.div>

      <motion.div
        className="flex w-full flex-col gap-4 md:max-w-sm"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: 3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-2xl font-bold">{findMeOnLabel || "Find me on"}</h2>
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Button key={link.href} variant="outline" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
