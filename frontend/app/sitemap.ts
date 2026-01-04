import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllPostsWithTranslations } from "@/lib/blog";
import { getBaseUrl } from "@/lib/utils";
import { MetadataRoute } from "next";
import { Locale } from "next-intl";

const host = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    // Static pages
    ...getEntries("/"),
    ...getEntries("/start-your-project"),
    ...getEntries("/privacy-policy"),
    ...getEntries("/blog"),
  ];

  const posts = await getAllPostsWithTranslations();
  const blogPosts = posts.map((post) => ({
    url: getUrl(
      { pathname: "/blog/[slug]", params: { slug: post.slug } },
      post.locale as Locale
    ),
    alternates: {
      languages: Object.fromEntries(
        post.translations.map((t) => [
          t.locale,
          getUrl(
            { pathname: "/blog/[slug]", params: { slug: t.slug } },
            t.locale as Locale
          ),
        ])
      ),
    },
  }));

  return [...staticPages, ...blogPosts];
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
