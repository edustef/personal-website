import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

type NavigationProps = {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  backLabel: string;
  nextLabel: string;
};

export function Navigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  backLabel,
  nextLabel,
}: NavigationProps) {
  return (
    <motion.div
      layout
      className="mt-8 flex justify-between items-center border-t pt-8"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {currentStep > 0 && (
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="size-5" /> {backLabel}
        </Button>
      )}
      <div className="flex-1" />
      {currentStep > 0 && currentStep < totalSteps && (
        <Button onClick={onNext}>
          {nextLabel} <ChevronRight className="size-5" />
        </Button>
      )}
    </motion.div>
  );
}
