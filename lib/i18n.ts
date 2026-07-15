import { cookies, headers } from 'next/headers'
import type { AppDict } from './dict-types'

export const LOCALES = ['en', 'tr', 'ru', 'fa', 'he'] as const
export type Locale = (typeof LOCALES)[number]

export function isRTL(locale: Locale) {
  return locale === 'fa' || locale === 'he'
}

export async function getLocale(): Promise<Locale> {
  const c = await cookies()
  const fromCookie = c.get('locale')?.value as Locale | undefined
  if (fromCookie && (LOCALES as readonly string[]).includes(fromCookie)) {
    return fromCookie
  }

  const h = await headers()
  const accept = h.get('accept-language') ?? ''
  const first = accept.split(',')[0]?.split('-')[0] as Locale
  return (LOCALES as readonly string[]).includes(first) ? first : 'en'
}

const dictLoaders: Record<Locale, () => Promise<{ default: AppDict }>> = {
  en: () => import('./dict-app-en'),
  tr: () => import('./dict-app-tr'),
  ru: () => import('./dict-app-ru'),
  fa: () => import('./dict-app-fa'),
  he: () => import('./dict-app-he'),
}

export async function getAppDict() {
  const locale = await getLocale()
  const mod = await dictLoaders[locale]()
  return { t: mod.default, locale, isRTL: isRTL(locale) }
}
