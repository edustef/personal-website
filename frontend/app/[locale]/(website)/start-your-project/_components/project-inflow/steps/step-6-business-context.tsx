"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { StepHeader } from "../step-header";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

type Step6BusinessContextProps = {
  inquiryId: Id<"projectInquiries">;
  onBusinessContextChange: (value: string) => Promise<void>;
  onSuccessCriteriaChange: (value: string) => Promise<void>;
};

export function Step6BusinessContext({
  inquiryId,
  onBusinessContextChange,
  onSuccessCriteriaChange,
}: Step6BusinessContextProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader
        title={t("step6.title")}
        description={t("step6.description")}
      />
      <Textarea
        value={inquiry.businessContext ?? ""}
        onChange={(e) => onBusinessContextChange(e.target.value)}
        placeholder={t("step6.businessContext.placeholder")}
        className="min-h-[120px]"
      />
      <div className="space-y-2">
        <Label>{t("step6.successCriteria.label")}</Label>
        <Textarea
          value={inquiry.successCriteria ?? ""}
          onChange={(e) => onSuccessCriteriaChange(e.target.value)}
          placeholder={t("step6.successCriteria.placeholder")}
        />
      </div>
    </motion.div>
  );
}

