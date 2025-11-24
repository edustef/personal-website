"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { CardOption } from "../card-option";
import { StepHeader } from "../step-header";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

type Step2AudiencePurposeProps = {
  inquiryId: Id<"projectInquiries">;
  onSelectAudience: (value: string) => Promise<void>;
  onSelectPurpose: (value: string) => Promise<void>;
};

export function Step2AudiencePurpose({
  inquiryId,
  onSelectAudience,
  onSelectPurpose,
}: Step2AudiencePurposeProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  const audienceOptions = [
    t("step2.audience.customers"),
    t("step2.audience.internalTeam"),
    t("step2.audience.community"),
    t("step2.audience.other"),
  ];

  const purposeOptions = [
    t("step2.purpose.generateLeads"),
    t("step2.purpose.sellProducts"),
    t("step2.purpose.showcasePortfolio"),
    t("step2.purpose.improveWorkflow"),
    t("step2.purpose.increaseConversions"),
    t("step2.purpose.validateIdea"),
    t("step2.purpose.other"),
  ];

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader
        title={t("step2.title")}
        description={t("step2.description")}
      />

      <div className="space-y-4">
        <Label>{t("step2.audience.label")}</Label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {audienceOptions.map((opt) => (
            <CardOption
              size="sm"
              key={opt}
              selected={inquiry.targetAudience === opt}
              onClick={() => onSelectAudience(opt)}
              title={opt}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>{t("step2.purpose.label")}</Label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {purposeOptions.map((opt) => (
            <CardOption
              size="sm"
              key={opt}
              selected={inquiry.projectPurpose === opt}
              onClick={() => onSelectPurpose(opt)}
              title={opt}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

