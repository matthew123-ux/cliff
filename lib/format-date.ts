import type { Locale } from './i18n'

const localeTag: Record<Locale, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  ru: 'ru-RU',
  fa: 'fa-IR',
  he: 'he-IL',
}

export function formatDate(
  value: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(localeTag[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime(value: string | Date, locale: Locale): string {
  return formatDate(value, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
