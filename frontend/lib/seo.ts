import { toPlainText } from "next-sanity";

import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import {
  localizeBlockContent,
  localizedImage,
  localizeField,
} from "@/sanity/lib/localization";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/utils";

export type LocalizedSettingsMetadata = {
  title: string;
  description?: string;
  ogImage?: ReturnType<typeof resolveOpenGraphImage>;
  metadataBase?: URL;
};

export async function getLocalizedSettingsMetadata(
  locale: string,
): Promise<LocalizedSettingsMetadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  if (!settings) {
    throw new Error("Settings not found");
  }

  const title = localizeField(settings.seo.title, locale);

  const descriptionBlocks = localizeBlockContent(
    settings.seo.description,
    locale,
  );
  const description = truncateText(toPlainText(descriptionBlocks));

  const localizedOgImage = localizedImage(settings.seo.ogImage, locale);
  const ogImage = resolveOpenGraphImage(localizedOgImage);

  const metadataBase = parseMetadataBase(localizedOgImage?.metadataBase);

  return {
    title,
    description,
    ogImage,
    metadataBase,
  };
}

function truncateText(value: string, maxLength = 160) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function parseMetadataBase(value: string | undefined) {
  if (!value) return undefined;
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export function getCanonicalUrl(
  locale: string,
  path: string = "",
): string {
  const baseUrl = getBaseUrl();
  const localePath = locale === routing.defaultLocale ? "" : `/${locale}`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${localePath}${cleanPath}`;
}
