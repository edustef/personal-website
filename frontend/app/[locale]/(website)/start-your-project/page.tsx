import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientProjectInflow } from "@/app/[locale]/(website)/start-your-project/client-project-inflow";
import { LocaleId, defaultLocale, routing } from "@/i18n/routing";
import { getCanonicalUrl, getLocalizedSettingsMetadata } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale as LocaleId;

  const [localizedSettings, t] = await Promise.all([
    getLocalizedSettingsMetadata(locale),
    getTranslations({ locale, namespace: "startYourProject" }),
  ]);

  const title = t("title");
  const localizedPath =
    locale === defaultLocale
      ? "/start-your-project"
      : routing.pathnames?.["/start-your-project"]?.[locale] ||
        "/start-your-project";
  const canonicalUrl = getCanonicalUrl(locale, localizedPath);

  return {
    title: `${title} | ${localizedSettings.title}`,
    description: localizedSettings.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function StartProjectPage(props: Props) {
  const params = await props.params;
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <ClientProjectInflow />
    </div>
  );
}
