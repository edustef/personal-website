import meTransparent from "@/assets/images/me-transparent.png";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutMeSectionClient } from "./about-me-section-client";

export default async function AboutMeSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <AboutMeSectionClient
      label={t("aboutMe.label")}
      headline={t("aboutMe.headline")}
      subtitle={t("aboutMe.subtitle")}
      description={t("aboutMe.description")}
      imageSrc={meTransparent.src}
    />
  );
}
