import {
  BlockContent,
  InternationalizedArrayBlockContent,
  InternationalizedArrayOgImage,
  InternationalizedArrayString,
} from "@/sanity.types";

export const languages = [
  { id: "en", title: "English" },
  { id: "ro", title: "Română" },
  { id: "es", title: "Español" },
] as const;

export type LanguageId = (typeof languages)[number]["id"];

export const defaultLanguage: LanguageId = "en";

export function localizeField<T extends InternationalizedArrayString>(
  field: T | null | undefined,
  locale: LanguageId = defaultLanguage,
) {
  const localized = field?.find((item) => item._key === locale);

  return localized?.value ?? "";
}

export function localizeBlockContent<
  T extends InternationalizedArrayBlockContent | null | undefined,
>(field: T, locale: LanguageId = defaultLanguage) {
  const localized = field?.find((item) => item._key === locale);

  return localized?.value ?? ([] as BlockContent);
}

export function localizedImage(
  image: InternationalizedArrayOgImage | null | undefined,
  locale: LanguageId,
) {
  if (!image) return undefined;

  const localized =
    image.find((item) => item._key === locale)?.value ??
    image.find((item) => item._key === defaultLanguage)?.value ??
    image[0]?.value;
  return localized ?? undefined;
}
