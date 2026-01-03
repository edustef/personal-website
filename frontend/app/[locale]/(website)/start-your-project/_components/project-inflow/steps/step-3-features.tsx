"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CardOption } from "../card-option";
import { StepHeader } from "../step-header";

type Step3FeaturesProps = {
  inquiryId: Id<"projectInquiries">;
  onToggle: (value: string) => Promise<void>;
};

export function Step3Features({ inquiryId, onToggle }: Step3FeaturesProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  const features = [
    t("step3.features.landingPage"),
    t("step3.features.multiPage"),
    t("step3.features.blog"),
    t("step3.features.booking"),
    t("step3.features.ecommerce"),
    t("step3.features.apiIntegrations"),
    t("step3.features.headlessCms"),
    t("step3.features.customComponents"),
    t("step3.features.authentication"),
    t("step3.features.userProfiles"),
    t("step3.features.chatMessaging"),
    t("step3.features.pushNotifications"),
    t("step3.features.mapsGeolocation"),
    t("step3.features.payments"),
    t("step3.features.aiAssistant"),
    t("step3.features.customChatbot"),
    t("step3.features.automatedWorkflows"),
    t("step3.features.dataDashboards"),
  ];

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader
        title={t("step3.title")}
        description={t("step3.description")}
      />
      <fieldset className="grid gap-3">
        <legend className="sr-only">{t("step3.title")}</legend>
        {features.map((opt) => (
          <CardOption
            key={opt}
            selected={inquiry.features?.includes(opt) ?? false}
            onChange={() => onToggle(opt)}
            name="features"
            value={opt}
            id={`features-${opt.replace(/\s+/g, "-").toLowerCase()}`}
            title={opt}
            multi
            compact
          />
        ))}
      </fieldset>
    </motion.div>
  );
}
