import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type ProgressBarProps = {
  className?: string;
  currentStep: number;
  totalSteps: number;
};

export function ProgressBar({
  className,
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <motion.div
          className="bg-primary h-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
