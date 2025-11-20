"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RenovationBadge } from "@/components/renovation-badge";

type HeroIntroProps = {
  headline?: string | null;
  tagline?: string | null;
  renovationLabelPrimary?: string | null;
  renovationLabelSecondary?: string | null;
  findMeOnLabel?: string | null;
  resumeButtonLabel?: string | null;
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
  resumeButtonLabel,
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
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between gap-16 md:justify-start">
      <motion.div
        className="flex flex-col gap-4 mix-blend-difference"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <RenovationBadge
          primary={renovationLabelPrimary}
          secondary={renovationLabelSecondary}
        />
        <h1 className="text-foreground max-w-3xl text-4xl leading-normal font-semibold text-pretty md:text-6xl md:leading-tight">
          {headline}
        </h1>
        {tagline && (
          <p className="text-muted-foreground text-lg md:text-xl">{tagline}</p>
        )}
      </motion.div>

      <motion.div
        className="flex w-full flex-col gap-4 md:max-w-sm"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: 3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-2xl font-bold">{findMeOnLabel || "Find me on"}</h2>
        <div className="flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <Button key={link.href} variant="outline" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {resumeButtonLabel && (
            <div>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="/files/eduard-stefan-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resumeButtonLabel || "Get my resume"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
