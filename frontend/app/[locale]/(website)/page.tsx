import { FloatingContactButton } from "@/components/contact-button-observer";
import FAQSection from "@/components/faq-section";
import HeroSection from "@/components/hero-section";
import AboutMeSection from "@/components/sections/about-me-section";
import ContactSection from "@/components/sections/contact-section";
import HowIPriceSection from "@/components/sections/how-i-price-section";
import HowIWorkSection from "@/components/sections/how-i-work-section";
import PortfolioSection from "@/components/sections/portfolio-section";
import ServicesSection from "@/components/sections/services-section";
import ToolsSection from "@/components/sections/tools-section";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
// import { InteractiveNebulaShader } from "@/components/ui/liquid-shader";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { faqs } from "@/lib/data/faqs";
import { services } from "@/lib/data/services";
import { getCanonicalUrl } from "@/lib/seo";
import {
  createFAQPageSchema,
  createServiceSchema,
  sanitizeJsonLd,
} from "@/lib/structured-data";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "home.seo" });

  return {
    alternates: {
      canonical: getPathname({ locale, href: "/" }),
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const profileT = await getTranslations({ locale, namespace: "profile" });
  const t = await getTranslations({ locale, namespace: "home" });
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const servicesT = await getTranslations({ locale, namespace: "services" });

  const socialLinksRaw = profileT.raw("socialLinks") as
    | Array<{ name: string; url: string }>
    | undefined;

  // Generate Schemas
  const faqData = faqs.map((f) => ({
    question: faqT(f.questionKey),
    answer: faqT.raw(f.answerKey) as string,
  }));
  const faqSchema = createFAQPageSchema(faqData, locale);

  const serviceSchemas = services.map((s) =>
    createServiceSchema({
      name: servicesT(s.titleKey),
      description: servicesT(s.descriptionKey),
      providerName: profileT("name"),
      url: getCanonicalUrl(locale, "/#services"),
    })
  );

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
      />
      {serviceSchemas.map((schema, index) => (
        <Script
          key={`service-schema-${index}`}
          id={`service-schema-${index}`}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for Schema.org JSON-LD
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(schema) }}
        />
      ))}
      <BackgroundPaperShaders />
      {/* <InteractiveNebulaShader disableCenterDimming /> */}
      <HeroSection />

      <ServicesSection />

      <PortfolioSection />

      <ToolsSection />

      <AboutMeSection />

      <HowIWorkSection />

      {/* <CaseStudiesSection /> */}

      <HowIPriceSection />

      <FAQSection />

      <ContactSection socialLinks={socialLinksRaw} />

      <FloatingContactButton contactMeText={t("scheduleCall")} />
    </>
  );
}
