import { toPlainText } from "next-sanity";

import {
  localizeBlockContent,
  localizeField,
  defaultLanguage,
  localizedImage,
} from "@/lib/i18n";
import type { LanguageId } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";


export type LocalizedSettingsMetadata = {
  title: string;
  description?: string;
  ogImage?: ReturnType<typeof resolveOpenGraphImage>;
  metadataBase?: URL;
};

export async function getLocalizedSettingsMetadata(
  locale: LanguageId,
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
