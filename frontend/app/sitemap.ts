import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";
import { locales, routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostsAndPages = await sanityFetch({
    query: sitemapData,
  });
  const baseUrl = getBaseUrl();

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const localeId = locale.id;
    const localePath = localeId === routing.defaultLocale ? "" : `/${localeId}`;

    sitemap.push({
      url: `${baseUrl}${localePath}`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "monthly",
    });

    if (routing.pathnames) {
      for (const [originalPath, localizedPaths] of Object.entries(
        routing.pathnames,
      )) {
        const localizedPath =
          localeId === routing.defaultLocale
            ? originalPath
            : localizedPaths && localeId in localizedPaths
              ? localizedPaths[localeId as keyof typeof localizedPaths]
              : originalPath;
        sitemap.push({
          url: `${baseUrl}${localePath}${localizedPath}`,
          lastModified: new Date(),
          priority: 0.9,
          changeFrequency: "monthly",
        });
      }
    }

    if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
      for (const p of allPostsAndPages.data) {
        if (p._type === "post") {
          sitemap.push({
            url: `${baseUrl}${localePath}/posts/${p.slug}`,
            lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
            priority: 0.5,
            changeFrequency: "never",
          });
        }
      }
    }
  }

  return sitemap;
}
