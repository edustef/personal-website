import { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  }

  return sitemap;
}
