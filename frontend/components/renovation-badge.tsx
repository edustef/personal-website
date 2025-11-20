"use client";

import { motion } from "motion/react";
import { RocketIcon } from "lucide-react";

type RenovationBadgeProps = {
  primary?: string | null;
  secondary?: string | null;
};

export function RenovationBadge({
  primary,
  secondary,
}: RenovationBadgeProps) {
  if (!primary && !secondary) {
    return null;
  }

  return (
    <div className="relative inline-flex w-fit">
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{
          padding: "1px",
          background:
            "linear-gradient(120deg, rgba(236,72,153,0.75), rgba(14,165,233,0.75), rgba(16,185,129,0.75), rgba(236,72,153,0.75))",
          backgroundSize: "250% 250%",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "150% 150%", "50% 0%", "0% 50%"],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-10 flex items-center gap-2 rounded-lg bg-secondary/30 px-5 py-2 text-secondary-foreground">
        <RocketIcon className="size-4" />
        <div className="flex flex-row items-center text-sm leading-none tracking-widest uppercase">
          <span>{primary}</span>
          <span className="font-bold ml-2">{secondary}</span>
        </div>
      </div>
    </div>
  );
}

