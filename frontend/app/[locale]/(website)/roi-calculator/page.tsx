import roiCalculatorOpengraphEn from "@/assets/images/roi-calculator-en.png";
import roiCalculatorOpengraphEs from "@/assets/images/roi-calculator-es.png";
import roiCalculatorOpengraphRo from "@/assets/images/roi-calculator-ro.png";
import RoiCalculatorSection from "@/components/sections/roi-calculator-section";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const roiCalculatorOgImages = {
  en: roiCalculatorOpengraphEn,
  es: roiCalculatorOpengraphEs,
  ro: roiCalculatorOpengraphRo,
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "roiCalculator.seo" });

  const title = t("title");
  const description = t("description");
  const ogImage = roiCalculatorOgImages[locale as keyof typeof roiCalculatorOgImages] || roiCalculatorOgImages.en;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, "/roi-calculator"),
    },
    openGraph: {
      type: "website",
      locale,
      title,
      description,
      images: [
        {
          url: ogImage.src,
          width: ogImage.width,
          height: ogImage.height,
          alt: description || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.src],
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
