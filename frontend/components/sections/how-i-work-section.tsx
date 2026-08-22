import { getWhatsAppUrl } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { HowIWorkSectionClient } from "./how-i-work-section-client";

const stepKeys = [
  "planning",
  "development",
  "deployment",
  "postDeployment",
] as const;

export default async function HowIWorkSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "howIWork" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const whatsappUrl = getWhatsAppUrl(profileT("phone"));

  const timelineData = stepKeys.map((key) => ({
    id: key,
    title: t(`${key}.title`),
    artifactLabel: t(`${key}.artifactLabel`),
    paragraphs: t.raw(`${key}.paragraphs`) as string[],
    bulletPoints: t.raw(`${key}.bulletPoints`) as string[],
  }));

  return (
    <HowIWorkSectionClient
      label={t("label")}
      headline={t("headline")}
      subtitle={t("subtitle")}
      timelineData={timelineData}
      cta={t("cta")}
      ctaUrl={whatsappUrl}
    />
  );
}
