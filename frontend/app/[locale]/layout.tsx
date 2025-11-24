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
import { getLocalizedSettingsMetadata } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/i18n/routing";

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

  return {
    metadataBase: localized.metadataBase,
    title: {
      template: `%s | ${localized.title}`,
      default: localized.title,
    },
    description: localized.description,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale.id, `/${locale.id}`]),
      ),
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

  return (
    <html
      lang={params.locale}
      className={`${dmSans.variable} ${dmMono.variable} dark bg-background text-foreground min-h-screen transition-colors duration-300`}
      suppressHydrationWarning
    >
      <body className="isolate transition-colors duration-300 ease-in-out">
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
