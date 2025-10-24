'use client'

import {LanguageId} from '@/lib/i18n'
import {createContext, useContext} from 'react'

const LocaleContext = createContext<LanguageId | null>(null)

export default function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: LanguageId
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const locale = useContext(LocaleContext)
  if (!locale) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return locale
}
