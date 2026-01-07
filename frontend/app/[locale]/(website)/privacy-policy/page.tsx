import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: getCanonicalUrl(locale, "/privacy-policy"),
    },
  };
}

export default async function PrivacyPolicyPage(props: Props) {
  const params = await props.params;
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <article className="prose prose-invert max-w-none">
        <h1 className="mb-8 text-2xl font-bold text-balance">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.introduction.title")}
          </h2>
          <p className="mb-4 text-pretty">
            {t("sections.introduction.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.dataController.title")}
          </h2>
          <p className="mb-4 text-pretty">
            {t("sections.dataController.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.dataCollected.title")}
          </h2>
          <p className="mb-4 text-pretty">
            {t("sections.dataCollected.intro")}
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li className="mb-2">{t("sections.dataCollected.items.email")}</li>
            <li className="mb-2">
              {t("sections.dataCollected.items.projectDetails")}
            </li>
            <li className="mb-2">
              {t("sections.dataCollected.items.technicalInfo")}
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.purpose.title")}
          </h2>
          <p className="mb-4 text-pretty">{t("sections.purpose.intro")}</p>
          <ul className="mb-4 list-disc pl-6">
            <li className="mb-2">
              {t("sections.purpose.items.communication")}
            </li>
            <li className="mb-2">
              {t("sections.purpose.items.projectEstimate")}
            </li>
            <li className="mb-2">{t("sections.purpose.items.analytics")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.legalBasis.title")}
          </h2>
          <p className="mb-4 text-pretty">{t("sections.legalBasis.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.dataRetention.title")}
          </h2>
          <p className="mb-4 text-pretty">
            {t("sections.dataRetention.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.yourRights.title")}
          </h2>
          <p className="mb-4 text-pretty">{t("sections.yourRights.intro")}</p>
          <ul className="mb-4 list-disc pl-6">
            <li className="mb-2">{t("sections.yourRights.items.access")}</li>
            <li className="mb-2">
              {t("sections.yourRights.items.rectification")}
            </li>
            <li className="mb-2">{t("sections.yourRights.items.erasure")}</li>
            <li className="mb-2">
              {t("sections.yourRights.items.restriction")}
            </li>
            <li className="mb-2">
              {t("sections.yourRights.items.dataPortability")}
            </li>
            <li className="mb-2">{t("sections.yourRights.items.object")}</li>
          </ul>
          <p className="mb-4 text-pretty">
            {
              t("sections.yourRights.contact").split(
                "contact@eduardstefan.dev"
              )[0]
            }
            <a
              href="mailto:contact@eduardstefan.dev"
              className="text-primary underline hover:no-underline"
            >
              contact@eduardstefan.dev
            </a>
            {
              t("sections.yourRights.contact").split(
                "contact@eduardstefan.dev"
              )[1]
            }
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.analytics.title")}
          </h2>
          <p className="mb-4 text-pretty">{t("sections.analytics.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.dataSecurity.title")}
          </h2>
          <p className="mb-4 text-pretty">
            {t("sections.dataSecurity.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.changes.title")}
          </h2>
          <p className="mb-4 text-pretty">{t("sections.changes.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-balance">
            {t("sections.contact.title")}
          </h2>
          <p className="mb-4 text-pretty">
            {t("sections.contact.content").split("contact@eduardstefan.dev")[0]}
            <a
              href="mailto:contact@eduardstefan.dev"
              className="text-primary underline hover:no-underline"
            >
              contact@eduardstefan.dev
            </a>
            {t("sections.contact.content").split("contact@eduardstefan.dev")[1]}
          </p>
        </section>
      </article>
    </div>
  );
}
