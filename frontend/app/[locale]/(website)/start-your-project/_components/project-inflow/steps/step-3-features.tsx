"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { CardOption } from "../card-option";
import { StepHeader } from "../step-header";
import { useTranslations } from "next-intl";

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
      <div className="grid grid-cols-2 gap-3">
        {features.map((opt) => (
          <CardOption
            key={opt}
            selected={inquiry.features?.includes(opt) ?? false}
            onClick={() => onToggle(opt)}
            title={opt}
            multi
            compact
          />
        ))}
      </div>
    </motion.div>
  );
}

