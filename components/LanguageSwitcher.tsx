'use client'

import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

const OPTIONS: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'ru', label: 'RU' },
  { code: 'fa', label: 'FA' },
  { code: 'he', label: 'HE' },
]

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter()

  const choose = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=31536000; samesite=lax`
    router.refresh()
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-slatey">
      <span className="sr-only">Language</span>
      <select
        value={current}
        onChange={(e) => choose(e.target.value)}
        className="rounded-full border border-mist-2 bg-white px-2.5 py-1 text-xs font-bold text-night outline-none focus:border-energy"
      >
        {OPTIONS.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
