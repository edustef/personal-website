import RoiCalculatorSection from "@/components/sections/roi-calculator-section";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "roiCalculator" });

  return {
    title: t("headline"),
    description: t("subtitle"),
    alternates: {
      canonical: getPathname({ locale, href: "/roi-calculator" }),
    },
  };
}

export default async function RoiCalculatorPage(props: Props) {
  const params = await props.params;
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <>
      <BackgroundPaperShaders />
      <RoiCalculatorSection />
    </>
  );
}
