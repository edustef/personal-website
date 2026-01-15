import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllPostSlugs } from "@/lib/blog";
import { getBaseUrl } from "@/lib/utils";
import { MetadataRoute } from "next";
import { Locale } from "next-intl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostSlugs();
  const staticPages = [
    // Static pages
    ...getEntries("/"),
    ...getEntries("/start-your-project"),
    ...getEntries("/roi-calculator"),
    ...getEntries("/privacy-policy"),
    ...getEntries("/blog"),
    ...posts.map((post) => ({
      url: getUrl(
        { pathname: "/blog/[slug]", params: { slug: post.slug } },
        post.locale as Locale
      ),
      alternates: {
        languages: {
          ...Object.fromEntries(
            post.translations.map((t) => [
              t.locale,
              getUrl(
                { pathname: "/blog/[slug]", params: { slug: t.slug } },
                t.locale as Locale
              ),
            ])
          ),
        },
      },
    })),
  ];

  return staticPages;
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
      },
    },
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return getBaseUrl() + pathname;
}
