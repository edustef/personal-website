"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { StepHeader } from "../step-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type Step4CurrentStatusProps = {
  inquiryId: Id<"projectInquiries">;
  onStatusChange: (value: string) => Promise<void>;
  onLinkChange: (value: string) => Promise<void>;
};

export function Step4CurrentStatus({
  inquiryId,
  onStatusChange,
  onLinkChange,
}: Step4CurrentStatusProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  const options = [
    t("step4.options.fromScratch"),
    t("step4.options.needsImprovement"),
    t("step4.options.haveDesigns"),
    t("step4.options.haveBranding"),
    t("step4.options.haveBackend"),
    t("step4.options.haveContent"),
    t("step4.options.justExploring"),
  ];

  const needsImprovement = inquiry.currentStatus === t("step4.options.needsImprovement");

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader title={t("step4.title")} />
      <RadioGroup
        value={inquiry.currentStatus ?? ""}
        onValueChange={onStatusChange}
      >
        {options.map((o) => (
          <div key={o} className="flex items-center space-x-2 py-1">
            <RadioGroupItem value={o} id={o} />
            <Label htmlFor={o}>{o}</Label>
          </div>
        ))}
      </RadioGroup>

      {needsImprovement && (
        <div className="space-y-2">
          <Label>{t("step4.currentLink.label")}</Label>
          <Input
            value={inquiry.currentLink ?? ""}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder={t("step4.currentLink.placeholder")}
          />
        </div>
      )}
    </motion.div>
  );
}

