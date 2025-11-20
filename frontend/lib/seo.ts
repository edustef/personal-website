import type { PortableTextBlock } from "next-sanity";

import {
  localizeBlockContent,
  localizeField,
  defaultLanguage,
} from "@/lib/i18n";
import type { LanguageId } from "@/lib/i18n";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import type { Settings } from "@/sanity.types";

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

  const title =
    localizeField(settings?.title, locale) ??
    localizeField(settings?.title, defaultLanguage) ??
    demo.title;

  const descriptionBlocks = localizeBlockContent(settings?.description, locale);
  const description =
    truncateText(portableTextToPlainText(descriptionBlocks)) ||
    truncateText(
      portableTextToPlainText(demo.description as PortableTextBlock[]),
    );

  const localizedOgImage = pickLocalizedImage(settings?.ogImage, locale);
  const ogImage = resolveOpenGraphImage(localizedOgImage);

  const metadataBase = parseMetadataBase(localizedOgImage?.metadataBase);

  return {
    title,
    description,
    ogImage,
    metadataBase,
  };
}

function pickLocalizedImage(
  image: Settings["ogImage"] | null | undefined,
  locale: LanguageId,
) {
  if (!image) return undefined;

  const localized =
    image.find((item) => item._key === locale)?.value ??
    image.find((item) => item._key === defaultLanguage)?.value ??
    image[0]?.value;
  return localized ?? undefined;
}

function portableTextToPlainText(
  blocks: PortableTextBlock[] | null | undefined,
) {
  if (!blocks || blocks.length === 0) return "";
  return blocks
    .map(
      (block) =>
        block.children?.map((child) => child.text ?? "").join("") ?? "",
    )
    .join("\n")
    .replace(/\s+/g, " ")
    .trim();
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
