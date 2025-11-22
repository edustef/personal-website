import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { servicesPageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { localizeField, type LanguageId } from "@/lib/i18n";
import { getLocalizedSettingsMetadata } from "@/lib/seo";
import { ServicesSelection } from "@/components/ServicesSelection";
import { ServicesContent } from "@/components/ServicesContent";
import { ServiceView } from "@/sanity.types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ audience?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale as LanguageId;
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

  const title = localizeField(page.title, locale);

  return {
    title: title
      ? `${title} | ${localizedSettings.title}`
      : localizedSettings.title,
    description: localizedSettings.description,
  };
}

export default async function ServicesPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale as LanguageId;
  const audience = searchParams.audience;

  const { data: page } = await sanityFetch({
    query: servicesPageQuery,
  });

  if (!page) {
    return notFound();
  }

  const selectionProps = {
    title: localizeField(page.selectionTitle, locale),
    description: localizeField(page.selectionDescription, locale),
    technicalLabel: localizeField(page.technicalOptionLabel, locale),
    technicalDescription: localizeField(
      page.technicalOptionDescription,
      locale,
    ),
    solutionLabel: localizeField(page.solutionOptionLabel, locale),
    solutionDescription: localizeField(page.solutionOptionDescription, locale),
  };

  // Render content based on selection
  if (audience === "technical" && page.technicalView) {
    return (
      <ServicesContent
        viewData={page.technicalView}
        onBack={async () => {
          "use server";
          // Server action not needed for simple link, handled by client component or we can pass a server action if we wanted to clear params server-side, but client router.push is easier.
          // Actually, for the server component, we just render. The client component handles the back navigation.
        }}
      />
    );
  }

  if (audience === "solution" && page.solutionView) {
    return <ServicesContent viewData={page.solutionView} onBack={() => {}} />;
  }

  // Default to selection screen
  return <ServicesSelection {...selectionProps} />;
}
