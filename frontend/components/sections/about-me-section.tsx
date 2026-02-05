import meTransparent from "@/assets/images/me-transparent.png";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutMeSectionClient } from "./about-me-section-client";

export default async function AboutMeSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const phone = profileT("phone");
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
    : "https://wa.me/40775378525";

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
