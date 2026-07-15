import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import type { AppDict } from '@/lib/dict-types'
import type { Locale } from '@/lib/i18n'
import { signOut } from '@/app/actions/auth'

type Props = {
  t: AppDict
  locale: Locale
  userEmail?: string | null
  isAdmin?: boolean
}

export default function TopBar({ t, locale, userEmail, isAdmin }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-mist-2 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-black text-night">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-energy text-sm text-white">
            N
          </span>
          <span className="hidden sm:inline">{t.common.appName}</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-semibold text-slatey sm:flex">
          <Link href="/" className="hover:text-night">
            {t.nav.home}
          </Link>
          {userEmail && (
            <Link href="/dashboard" className="hover:text-night">
              {t.nav.dashboard}
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="hover:text-night">
              {t.nav.admin}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          {userEmail ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-mist-2 px-3 py-1.5 text-xs font-bold text-slatey hover:bg-mist"
              >
                {t.nav.logout}
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-energy px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
