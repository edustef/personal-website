"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { CardOption } from "../card-option";
import { StepHeader } from "../step-header";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

type Step5BudgetTimelineProps = {
  inquiryId: Id<"projectInquiries">;
  onBudgetChange: (value: string) => Promise<void>;
  onTimelineChange: (value: string) => Promise<void>;
};

export function Step5BudgetTimeline({
  inquiryId,
  onBudgetChange,
  onTimelineChange,
}: Step5BudgetTimelineProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  const budgetOptions = [
    t("step5.budget.range1"),
    t("step5.budget.range2"),
    t("step5.budget.range3"),
    t("step5.budget.range4"),
    t("step5.budget.range5"),
    t("step5.budget.dontKnow"),
  ];

  const timelineOptions = [
    t("step5.timeline.asap"),
    t("step5.timeline.oneTwoMonths"),
    t("step5.timeline.threePlusMonths"),
    t("step5.timeline.justExploring"),
  ];

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader
        title={t("step5.title")}
        description={t("step5.description")}
      />

      <div className="space-y-4">
        <Label>{t("step5.budget.label")}</Label>
        <div className="grid grid-cols-2 gap-3">
          {budgetOptions.map((opt) => (
            <CardOption
              key={opt}
              selected={inquiry.budgetRange === opt}
              onClick={() => onBudgetChange(opt)}
              title={opt}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>{t("step5.timeline.label")}</Label>
        <Select value={inquiry.timeline} onValueChange={onTimelineChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("step5.timeline.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {timelineOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
