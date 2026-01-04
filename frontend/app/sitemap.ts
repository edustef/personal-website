import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/utils";
import { MetadataRoute } from "next";
import { Locale } from "next-intl";

const host = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    // Static pages
    ...getEntries("/"),
    ...getEntries("/start-your-project"),
    ...getEntries("/privacy-policy"),
  ];
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: {
        ...Object.fromEntries(
          routing.locales.map((cur) => [cur, getUrl(href, cur)])
        ),
        "x-default": host + (href === "/" ? "" : href),
      },
    },
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}
