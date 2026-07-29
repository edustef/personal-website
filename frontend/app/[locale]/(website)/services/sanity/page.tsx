import SanityServicePage from "@/components/sections/sanity-service-page";
import { BackgroundPaperShaders } from "@/components/ui/background-paper-shaders";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  createFAQPageSchema,
  createServiceSchema,
  sanitizeJsonLd,
} from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";

type Props = {
  params: Promise<{ locale: string }>;
};

type FAQItem = {
  question: string;
  answer: string;
};

function getSanityServiceUrl(locale: string) {
  return (
    getBaseUrl() +
    getPathname({
      locale,
      href: "/services/sanity",
    })
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: "sanityService.seo",
  });

  const title = t("title");
  const description = t("description");
  const canonical = getSanityServiceUrl(locale);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SanityPage(props: Props) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [t, profileT] = await Promise.all([
    getTranslations({ locale, namespace: "sanityService" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);

  const faqItems = t.raw("faq.items") as FAQItem[];
  const faqSchema = createFAQPageSchema(faqItems, locale);
  const serviceSchema = createServiceSchema({
    name: t("seo.serviceName"),
    description: t("seo.description"),
    providerName: profileT("name"),
    serviceType: "Sanity CMS Development",
    url: getSanityServiceUrl(locale),
  });

  return (
    <>
      <Script
        id="sanity-service-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is sanitized before injection.
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(serviceSchema) }}
      />
      <Script
        id="sanity-faq-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is sanitized before injection.
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
      />
      <BackgroundPaperShaders />
      <SanityServicePage />
    </>
  );
}
