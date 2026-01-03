"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CardOption } from "../card-option";
import { StepHeader } from "../step-header";

type Step1ProjectTypeProps = {
  inquiryId: Id<"projectInquiries">;
  onToggle: (value: string) => Promise<void>;
};

export function Step1ProjectType({
  inquiryId,
  onToggle,
}: Step1ProjectTypeProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  const options = [
    t("step1.options.newWebsite"),
    t("step1.options.improveWebsite"),
    t("step1.options.mobileApp"),
    t("step1.options.aiFeatures"),
    t("step1.options.performance"),
    t("step1.options.maintenance"),
    t("step1.options.notSure"),
  ];

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader
        title={t("step1.title")}
        description={t("step1.description")}
      />
      <fieldset className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <legend className="sr-only">{t("step1.title")}</legend>
        {options.map((opt) => (
          <CardOption
            size="sm"
            key={opt}
            selected={inquiry.projectType?.includes(opt) ?? false}
            onChange={() => onToggle(opt)}
            name="projectType"
            value={opt}
            id={`projectType-${opt.replace(/\s+/g, "-").toLowerCase()}`}
            title={opt}
            multi
          />
        ))}
      </fieldset>
    </motion.div>
  );
}
