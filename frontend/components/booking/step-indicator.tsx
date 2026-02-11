"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, ClipboardCheck, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { cn } from "@/lib/utils";

export type BookingStep = "date" | "slot" | "verify" | "confirmed";

interface StepIndicatorProps {
  currentStep: BookingStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations("booking.steps");

  const STEPS: { key: BookingStep; label: string; icon: React.ElementType }[] =
    [
      { key: "date", label: t("date"), icon: Calendar },
      { key: "slot", label: t("time"), icon: Clock },
      { key: "verify", label: t("confirm"), icon: ClipboardCheck },
    ];

  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.key}>
            <motion.div
              className={cn(
                "relative flex items-center justify-center overflow-hidden",
                "w-10 h-10 rounded-full",
                isActive &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                isCompleted &&
                  "bg-primary/20 text-primary border border-primary/30",
                !isActive &&
                  !isCompleted &&
                  "bg-muted/50 text-muted-foreground border border-border/50"
              )}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              )}
              <AnimatePresence initial={false}>
                {isCompleted ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      opacity: 1,
                      rotate: 0,
                    }}
                    exit={{ scale: 0, opacity: 0, rotate: 90 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {index < STEPS.length - 1 && (
              <div className="relative w-8 h-0.5 rounded-full bg-border/50 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                    delay: index < currentIndex ? 0.1 : 0,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
