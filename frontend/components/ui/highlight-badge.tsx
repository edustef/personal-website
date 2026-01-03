"use client";

import { type CommonProps, cn } from "@/lib/utils";
import { RocketIcon } from "lucide-react";
import { motion } from "motion/react";

type HighlightBadgeProps = CommonProps & {
  href?: string;
};

export function HighlightBadge({
  children,
  className,
  href,
}: HighlightBadgeProps) {
  const content = (
    <>
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
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <div className="bg-secondary/30 text-secondary-foreground relative z-10 flex items-center gap-2 rounded-lg px-5 py-2 transition-colors hover:bg-secondary/40">
        <RocketIcon className="size-4" />
        <div className="flex flex-row items-center leading-none">
          {children}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("relative inline-flex w-fit cursor-pointer", className)}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cn("relative inline-flex w-fit", className)}>{content}</div>
  );
}
