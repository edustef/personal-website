import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { servicesPageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { getLocalizedSettingsMetadata } from "@/lib/seo";
import { localizeField } from "@/sanity/lib/localization";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ClientProjectInflow } from "@/components/client-project-inflow";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const [{ data: page }, localizedSettings] = await Promise.all([
    sanityFetch({ query: servicesPageQuery, params: { locale } }),
    getLocalizedSettingsMetadata(locale),
  ]);

  if (!page) {
    return {
      title: localizedSettings.title,
      description: localizedSettings.description,
    };
  }

  const title = localizeField(page.seo?.title, locale);

  return {
    title: title
      ? `${title} | ${localizedSettings.title}`
      : localizedSettings.title,
    description: localizedSettings.description,
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
