import {InternationalizedArrayBlockContent, InternationalizedArrayString} from '@/sanity.types'

export const languages = [
  {id: 'en', title: 'English'},
  {id: 'ro', title: 'Romanian'},
  {id: 'es', title: 'Spanish'},
] as const

export type LanguageId = (typeof languages)[number]['id']

export const defaultLanguage: LanguageId = 'en'

export function localizeField<T extends InternationalizedArrayString | null | undefined>(
  field: T,
  locale: LanguageId = defaultLanguage,
): string | null {
  if (!field) return null
  const localized = field.find((item) => item._key === locale)
  if (localized) return localized.value ?? null
  const fallback = field.find((item) => item._key === defaultLanguage)
  return fallback?.value ?? field[0]?.value ?? null
}

export function localizeBlockContent<
  T extends InternationalizedArrayBlockContent | null | undefined,
>(field: T, locale: LanguageId = defaultLanguage): any[] | null {
  if (!field) return null
  const localized = field.find((item) => item._key === locale)
  if (localized) return localized.value ?? null
  const fallback = field.find((item) => item._key === defaultLanguage)
  return fallback?.value ?? field[0]?.value ?? null
}
