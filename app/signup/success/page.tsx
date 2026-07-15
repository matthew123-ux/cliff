import Link from 'next/link'
import TopBar from '@/components/TopBar'
import { getAppDict } from '@/lib/i18n'

export default async function SignupSuccessPage() {
  const { t, locale } = await getAppDict()

  return (
    <div className="flex min-h-full flex-col">
      <TopBar t={t} locale={locale} />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 text-center">
        <div className="rounded-2xl border border-mist-2 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl">
            ✓
          </div>
          <h1 className="text-xl font-black text-night">{t.auth.signupSuccessTitle}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slatey">{t.auth.signupSuccessBody}</p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-energy px-6 text-sm font-bold text-white hover:bg-blue-700"
          >
            {t.nav.login}
          </Link>
        </div>
      </main>
    </div>
  )
}
