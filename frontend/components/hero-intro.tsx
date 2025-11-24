"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

export function HeroIntro({ className, children }: CommonProps) {
  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between gap-16 md:justify-start",
        className,
      )}
    >
      {children}
    </section>
  );
}

export const HeroIntroContent = ({ children, className }: CommonProps) => {
  return (
    <motion.div
      className={cn("flex flex-col gap-4 mix-blend-difference", className)}
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const HeroIntroSocialLinks = ({ children, className }: CommonProps) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-4 mix-blend-difference md:flex-row",
        className,
      )}
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const HeroIntroCtaButtons = ({ children, className }: CommonProps) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-4 mix-blend-difference md:flex-row",
        className,
      )}
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
