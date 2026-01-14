import { getLocale, getTranslations } from "next-intl/server";
import { StatsSectionClient } from "./stats-section-client";

export default async function StatsSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "stats" });

  const metrics = [
    {
      value: t("metrics.yearsExperience.value"),
      labelKey: t("metrics.yearsExperience.label"),
    },
    {
      value: t("metrics.fundsRaised.value"),
      labelKey: t("metrics.fundsRaised.label"),
    },
    {
      value: t("metrics.investors.value"),
      labelKey: t("metrics.investors.label"),
    },
    {
      value: t("metrics.processingTimeReduction.value"),
      labelKey: t("metrics.processingTimeReduction.label"),
    },
  ];

  return (
    <StatsSectionClient
      label={t("label")}
      headline={t("headline")}
      subtitle={t("subtitle")}
      metrics={metrics}
    />
  );
}
