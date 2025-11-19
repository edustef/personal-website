import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { toPlainText } from "next-sanity";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";

import DraftModeToast from "@/components/DraftModeToast";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { handleError } from "../../lib/client-utils";
import { ThemeProvider } from "@/components/theme-provider";
import { languages, type LanguageId } from "@/lib/i18n";
import { LocaleProvider } from "./locale-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import underConstructionImage from "@/assets/images/under-construction.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export async function generateStaticParams() {
  return languages.map((lang) => ({
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
  const locale = params.locale as LanguageId;
  const { isEnabled: isDraftMode } = await draftMode();

  if (!languages.find((lang) => lang.id === locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${dmMono.variable} dark bg-background text-foreground`}
      suppressHydrationWarning
    >
      <body className="isolate">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider locale={locale}>
            <Toaster />
            {isDraftMode && (
              <>
                <DraftModeToast />
                <VisualEditing />
              </>
            )}
            <SanityLive onError={handleError} />
            {props.children}
          </LocaleProvider>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
