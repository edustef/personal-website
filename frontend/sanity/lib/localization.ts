import { defaultLocale, LocaleId } from "@/i18n/routing";
import {
  BlockContent,
  InternationalizedArrayBlockContent,
  InternationalizedArrayOgImage,
  InternationalizedArrayString,
} from "@/sanity.types";

export function localizeField<T extends InternationalizedArrayString>(
  field: T | null | undefined,
  locale: string = defaultLocale,
) {
  const localized = field?.find((item) => item._key === locale);

  return localized?.value ?? "";
}

export function localizeBlockContent<
  T extends InternationalizedArrayBlockContent | null | undefined,
>(field: T, locale: string = defaultLocale) {
  const localized = field?.find((item) => item._key === locale);

  return localized?.value ?? ([] as BlockContent);
}

export function localizedImage(
  image: InternationalizedArrayOgImage | null | undefined,
  locale: string,
) {
  if (!image) return undefined;

  const localized =
    image.find((item) => item._key === locale)?.value ??
    image.find((item) => item._key === defaultLocale)?.value ??
    image[0]?.value;
  return localized ?? undefined;
}
