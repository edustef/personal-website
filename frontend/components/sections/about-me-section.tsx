import meTransparent from "@/assets/images/me-transparent.png";
import { getWhatsAppUrl } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutMeSectionClient } from "./about-me-section-client";

export default async function AboutMeSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const whatsappUrl = getWhatsAppUrl(profileT("phone"));

  return (
    <AboutMeSectionClient
      label={t("aboutMe.label")}
      headline={t("aboutMe.headline")}
      subtitle={t("aboutMe.subtitle")}
      description={t("aboutMe.description")}
      image={meTransparent}
      cta={t("aboutMe.cta")}
      ctaUrl={whatsappUrl}
    />
  );
}
