"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface SlotButtonProps {
  time: string;
  isSelected: boolean;
  isTaken: boolean;
  onClick: () => void;
}

export function SlotButton({
  time,
  isSelected,
  isTaken,
  onClick,
}: SlotButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={isTaken}
      onClick={onClick}
      className={cn(
        "relative group w-full h-11 rounded-md font-mono",
        "transition-all duration-200 overflow-hidden",
        "border",
        isSelected &&
          "bg-primary text-primary-foreground border-primary font-semibold",
        !isSelected &&
          !isTaken &&
          "bg-muted/50 text-foreground border-border/50 hover:bg-accent hover:border-border",
        isTaken &&
          "cursor-not-allowed bg-transparent border-transparent opacity-30"
      )}
      whileHover={!isTaken && !isSelected ? { scale: 1.02 } : {}}
      whileTap={!isTaken ? { scale: 0.98 } : {}}
    >
      {isTaken ? (
        <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
          <span className="line-through">{time}</span>
        </span>
      ) : (
        <span className="relative z-10 text-base">{time}</span>
      )}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-primary"
          layoutId="selectedSlot"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {isSelected && (
        <span className="absolute top-2 right-2 z-10 text-primary-foreground">
          <Check className="w-4 h-4" />
        </span>
      )}
    </motion.button>
  );
}
