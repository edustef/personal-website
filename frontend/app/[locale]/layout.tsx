import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";

import DraftModeToast from "@/components/draft-mode-toast";
import { SanityLive } from "@/sanity/lib/live";
import { handleError } from "../../lib/client-utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { getLocalizedSettingsMetadata, getCanonicalUrl } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";
import { locales, routing } from "@/i18n/routing";
import { sanityFetch } from "@/sanity/lib/live";
import { homeQuery, settingsQuery } from "@/sanity/lib/queries";
import { createPersonSchema, createWebSiteSchema } from "@/lib/structured-data";
import { localizeField } from "@/sanity/lib/localization";
import { urlForImage } from "@/sanity/lib/utils";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: MetadataProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const localized = await getLocalizedSettingsMetadata(locale);
  const alternateLocale = locales
    .map((lang) => lang.id)
    .filter((lang) => lang !== locale);

  const hreflangUrls = locales.map((loc) => {
    const localePath = loc.id === routing.defaultLocale ? "" : `/${loc.id}`;
    const url = getCanonicalUrl(loc.id, "");
    return [loc.id, url];
  });

  return {
    metadataBase: localized.metadataBase,
    title: {
      template: `%s | ${localized.title}`,
      default: localized.title,
    },
    description: localized.description,
    alternates: {
      languages: Object.fromEntries(hreflangUrls),
    },
    openGraph: {
      type: "website",
      locale,
      alternateLocale,
      title: localized.title,
      description: localized.description,
      images: localized.ogImage ? [localized.ogImage] : undefined,
    },
    twitter: {
      card: localized.ogImage ? "summary_large_image" : "summary",
      title: localized.title,
      description: localized.description,
      images: localized.ogImage ? [localized.ogImage.url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({
    locale: lang.id,
  }));
}

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout(props: Props) {
  const params = await props.params;
  const { isEnabled: isDraftMode } = await draftMode();

  if (!locales.find((locale) => locale.id === params.locale)) {
    notFound();
  }

  const [{ data: home }, localizedSettings] = await Promise.all([
    sanityFetch({ query: homeQuery, params: { locale: params.locale } }),
    getLocalizedSettingsMetadata(params.locale),
  ]);

  const personSchema = home?.profile
    ? createPersonSchema(
        {
          ...home.profile,
          motto: localizeField(home.profile.motto, params.locale),
          about: localizeField(home.profile.about, params.locale),
          workPreference: localizeField(
            home.profile.workPreference,
            params.locale,
          ),
          picture: urlForImage(home.profile.picture)?.url() || null,
        },
        params.locale,
      )
    : null;

  const webSiteSchema = createWebSiteSchema(
    localizedSettings.title,
    localizedSettings.description,
    params.locale,
  );

  return (
    <html
      lang={params.locale}
      className={`${dmSans.variable} ${dmMono.variable} dark bg-background text-foreground min-h-screen transition-colors duration-300`}
      suppressHydrationWarning
    >
      <body className="isolate transition-colors duration-300 ease-in-out">
        {personSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(personSchema),
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <NextIntlClientProvider>
          <ConvexClientProvider>
            <ThemeProvider attribute="class" forcedTheme="dark">
              <Toaster />
              {isDraftMode && (
                <>
                  <DraftModeToast />
                  <VisualEditing />
                </>
              )}
              <SanityLive onError={handleError} />
              {props.children}
              <SpeedInsights />
            </ThemeProvider>
          </ConvexClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
