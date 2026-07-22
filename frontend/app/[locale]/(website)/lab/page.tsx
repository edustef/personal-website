import { MagneticDockDemo } from "@/components/lab/magnetic-dock-demo";
import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

type DockLabels = {
  home: string;
  search: string;
  layers: string;
  ideas: string;
  settings: string;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "lab" });

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    alternates: {
      canonical: getCanonicalUrl(locale, "/lab"),
    },
  };
}

export default async function LabPage(props: Props) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "lab" });
  const dockLabels = t.raw("dock.items") as DockLabels;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <header className="grid gap-10 pb-20 md:grid-cols-[1fr_2fr] md:items-end md:pb-28">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{t("count")}</p>
        </div>
        <div>
          <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] leading-[0.92] tracking-[-0.055em] text-balance text-foreground">
            {t("title")}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            {t("intro")}
          </p>
        </div>
      </header>

      <MagneticDockDemo
        activeLabel={t("dock.activeLabel")}
        ariaLabel={t("dock.ariaLabel")}
        category={t("dock.category")}
        description={t("dock.description")}
        index={t("dock.index")}
        instruction={t("dock.instruction")}
        labels={dockLabels}
        title={t("dock.title")}
      />

      <footer className="flex justify-end pt-12 md:pt-16">
        <p className="max-w-sm text-right text-sm leading-relaxed text-muted-foreground">
          {t("next")}
        </p>
      </footer>
    </div>
  );
}
