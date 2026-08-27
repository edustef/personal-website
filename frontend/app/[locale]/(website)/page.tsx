import { FloatingContactButton } from "@/components/contact-button-observer";
import FAQSection from "@/components/faq-section";
import HeroSection from "@/components/hero-section";
import AboutMeSection from "@/components/sections/about-me-section";
import ContactSection from "@/components/sections/contact-section";
// import PortfolioSection from "@/components/sections/portfolio-section";
import SanitySpotlightSection from "@/components/sections/sanity-spotlight-section";
import ServicesSection from "@/components/sections/services-section";
import WaysToWorkTogetherSection from "@/components/sections/ways-to-work-together-section";
// import { InteractiveNebulaShader } from "@/components/ui/liquid-shader";
import { routing } from "@/i18n/routing";
import { faqs } from "@/lib/data/faqs";
import { services } from "@/lib/data/services";
import {
  getCanonicalUrl,
  getLocalizedAlternates,
  getLocalizedUrl,
} from "@/lib/seo";
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

  return {
    alternates: {
      canonical: getLocalizedUrl("/", locale),
      languages: getLocalizedAlternates("/"),
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
      {/* <InteractiveNebulaShader disableCenterDimming /> */}
      <HeroSection />

      {/* Verified case studies will sit here once proof data is approved. */}

      <ServicesSection />

      <SanitySpotlightSection />

      <WaysToWorkTogetherSection />

      <AboutMeSection />

      <FAQSection />

      <ContactSection socialLinks={socialLinksRaw} />

      <FloatingContactButton contactMeText={t("letsChat")} />
    </>
  );
}
