import homeOpengraphEn from "@/assets/images/home-opengraph-en.png";
import homeOpengraphEs from "@/assets/images/home-opengraph-es.png";
import homeOpengraphRo from "@/assets/images/home-opengraph-ro.png";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/utils";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export type LocalizedSettingsMetadata = {
  title: string;
  description?: string;
  ogImage?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  metadataBase?: URL;
};

const ogImages = {
  en: homeOpengraphEn,
  es: homeOpengraphEs,
  ro: homeOpengraphRo,
};

export async function getLocalizedSettingsMetadata(
  locale: string
): Promise<LocalizedSettingsMetadata> {
  const t = await getTranslations({ locale, namespace: "settings.seo" });

  const title = t("title");
  const description = t("description");
  const ogImage = ogImages[locale as keyof typeof ogImages] || ogImages.en;

  return {
    title,
    description,
    ogImage: {
      url: ogImage.src,
      width: ogImage.width,
      height: ogImage.height,
      alt: description || title,
    },
    metadataBase: new URL(getBaseUrl()),
  };
}

export function getCanonicalUrl(locale: string, path = ""): string {
  const baseUrl = getBaseUrl();

  if (path === "/" || path === "") {
    return getLocalizedUrl("/", locale);
  }

  if (path in routing.pathnames) {
    return getLocalizedUrl(path as StaticHref, locale);
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`;
}

type StaticHref = Exclude<keyof typeof routing.pathnames, "/blog/[slug]">;

export function getLocalizedUrl(href: StaticHref, locale: string): string {
  return (
    getBaseUrl() +
    getPathname({
      locale: locale as Locale,
      href,
    })
  );
}

export function getLocalizedAlternates(href: StaticHref) {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocalizedUrl(href, locale)])
  );

  return {
    ...languages,
    "x-default": getLocalizedUrl(href, routing.defaultLocale),
  };
}
