"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { CardOption } from "../card-option";
import { useTranslations } from "next-intl";

type Step0TechSelectionProps = {
  inquiryId: Id<"projectInquiries">;
  onSelect: (isTech: boolean) => Promise<void>;
};

export function Step0TechSelection({
  inquiryId,
  onSelect,
}: Step0TechSelectionProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  if (!inquiry) return null;

  return (
    <motion.div layout className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{t("step0.title")}</h2>
      <p className="text-muted-foreground">{t("step0.description")}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CardOption
          selected={inquiry.isTech === true}
          onClick={async () => {
            await onSelect(true);
          }}
          title={t("step0.technical.title")}
          description={t("step0.technical.description")}
        />
        <CardOption
          selected={inquiry.isTech === false}
          onClick={async () => {
            await onSelect(false);
          }}
          title={t("step0.nonTechnical.title")}
          description={t("step0.nonTechnical.description")}
        />
      </div>
    </motion.div>
  );
}

