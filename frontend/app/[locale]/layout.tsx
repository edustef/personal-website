import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cardo, DM_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsProvider } from "@/components/nuqs-provider";
import { locales } from "@/i18n/routing";
import { getLocalizedSettingsMetadata } from "@/lib/seo";
import {
  createPersonSchema,
  createWebSiteSchema,
  sanitizeJsonLd,
} from "@/lib/structured-data";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Script from "next/script";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: MetadataProps
): Promise<Metadata> {
  const { locale } = await props.params;
  const localized = await getLocalizedSettingsMetadata(locale);

  return {
    metadataBase: localized.metadataBase,
    title: {
      template: `%s | ${localized.title}`,
      default: localized.title,
    },
    description: localized.description,
    openGraph: {
      type: "website",
      locale,
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
    icons: {
      icon: [
        { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-144x144.png", sizes: "144x144", type: "image/png" },
      ],
      apple: [
        { url: "/icon-144x144.png", sizes: "144x144", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({
    locale: lang.id,
  }));
}

const cardo = Cardo({
  weight: ["400", "700"],
  variable: "--font-cardo",
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

  if (!locales.find((locale) => locale.id === params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  const [localizedSettings, profileT, settingsT] = await Promise.all([
    getLocalizedSettingsMetadata(params.locale),
    getTranslations({ locale: params.locale, namespace: "profile" }),
    getTranslations({ locale: params.locale, namespace: "settings" }),
  ]);

  const socialLinks = profileT.raw("socialLinks") as Array<{
    name: string;
    url: string;
  }>;

  const personSchema = createPersonSchema(
    {
      name: profileT("name"),
      email: profileT("email"),
      phone: profileT("phone"),
      about: profileT("about"),
      picture: null,
      socialLinks: socialLinks.map((link) => ({ url: link.url })),
    },
    params.locale
  );

  const webSiteSchema = createWebSiteSchema(
    settingsT("title"),
    localizedSettings.description,
    params.locale
  );

  return (
    <html
      lang={params.locale}
      className={`${cardo.variable} ${dmMono.variable} dark font-light bg-background text-foreground min-h-screen transition-colors duration-300`}
      suppressHydrationWarning
    >
      <body className="isolate transition-colors duration-300 ease-in-out">
        {personSchema && (
          <Script
            type="application/ld+json"
            strategy="afterInteractive"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: sanitizeJsonLd(personSchema),
            }}
          />
        )}
        <Script
          type="application/ld+json"
          strategy="afterInteractive"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: sanitizeJsonLd(webSiteSchema),
          }}
        />
        <NextIntlClientProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <NuqsProvider>
                <Toaster />
                {props.children}
                <SpeedInsights />
              </NuqsProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
