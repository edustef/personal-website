import {
  InternationalizedArrayBlockContent,
  InternationalizedArrayString,
} from "@/sanity.types";
import type { PortableTextBlock } from "next-sanity";

export const languages = [
  { id: "en", title: "English" },
  { id: "ro", title: "Română" },
  { id: "es", title: "Español" },
] as const;

export type LanguageId = (typeof languages)[number]["id"];

export const defaultLanguage: LanguageId = "en";

export function localizeField<
  T extends InternationalizedArrayString | null | undefined,
>(field: T, locale: LanguageId = defaultLanguage): string | null {
  if (!field) return null;
  if (!Array.isArray(field)) return null;

  const localized = field.find((item) => item._key === locale);
  if (localized) return localized.value ?? null;
  const fallback = field.find((item) => item._key === defaultLanguage);
  return fallback?.value ?? field[0]?.value ?? null;
}

export function localizeBlockContent<
  T extends InternationalizedArrayBlockContent | null | undefined,
>(field: T, locale: LanguageId = defaultLanguage): PortableTextBlock[] {
  if (!field || !Array.isArray(field)) return [];

  const localized = field.find((item) => item._key === locale);
  if (localized?.value) return localized.value as PortableTextBlock[];
  const fallback = field.find((item) => item._key === defaultLanguage);
  if (fallback?.value) return fallback.value as PortableTextBlock[];
  return (field[0]?.value ?? []) as PortableTextBlock[];
}
