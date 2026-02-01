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
    ...posts.map((post) => {
      // Find English version for x-default, or fallback to current post
      const englishVersion = post.translations.find((t) => t.locale === "en");
      const xDefaultSlug = englishVersion?.slug || post.slug;

      return {
        url: getUrl(
          { pathname: "/blog/[slug]", params: { slug: post.slug } },
          post.locale as Locale
        ),
        alternates: {
          languages: {
            "x-default": `${getBaseUrl()}/blog/${xDefaultSlug}`,
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
      };
    }),
  ];

  return staticPages;
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: {
        "x-default": getXDefaultUrl(href),
        ...Object.fromEntries(
          routing.locales.map((cur) => [cur, getUrl(href, cur)])
        ),
      },
    },
  }));
}

function getXDefaultUrl(href: Href) {
  // x-default points to the root URL without locale prefix
  // This tells Google the root is the language negotiator
  if (typeof href === "string") {
    return getBaseUrl() + href;
  }
  const params = "params" in href ? href.params : undefined;
  const slug = params && "slug" in params ? String(params.slug) : "";
  const pathname = href.pathname.replace("[slug]", slug);
  return getBaseUrl() + pathname;
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return getBaseUrl() + pathname;
}
