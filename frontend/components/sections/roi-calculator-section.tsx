import { getLocale, getTranslations } from "next-intl/server";
import { RoiCalculatorSectionClient } from "./roi-calculator-section-client";

export default async function RoiCalculatorSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "roiCalculator" });

  return (
    <RoiCalculatorSectionClient
      locale={locale}
      label={t("label")}
      headline={t("headline")}
      subtitle={t("subtitle")}
      description={t("description")}
      yourMetrics={t("yourMetrics")}
      metricsDescription={t("metricsDescription")}
      monthlyVisitors={t("monthlyVisitors")}
      conversionRate={t("conversionRate")}
      avgOrderValue={t("avgOrderValue")}
      projectedImprovement={t("projectedImprovement")}
      upliftDescription={t("upliftDescription")}
      potentialReturns={t("potentialReturns")}
      potentialDescription={t("potentialDescription", { uplift: "{uplift}" })}
      extraYearlyRevenue={t("extraYearlyRevenue")}
      monthlyGrowth={t("monthlyGrowth")}
      projectedAnnual={t("projectedAnnual")}
      currentMonthlyRevenue={t("currentMonthlyRevenue")}
      projectedMonthlyRevenue={t("projectedMonthlyRevenue")}
      chartCurrent={t("chartCurrent")}
      chartProjected={t("chartProjected")}
      disclaimer={t("disclaimer")}
    />
  );
}
