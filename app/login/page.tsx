import Link from 'next/link'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import SubmitButton from '@/components/SubmitButton'
import { signIn } from '@/app/actions/auth'
import { getAppDict } from '@/lib/i18n'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { t, locale } = await getAppDict()
  const { error } = await searchParams

  return (
    <div className="flex min-h-full flex-col pb-20 sm:pb-0">
      <TopBar t={t} locale={locale} />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <h1 className="text-2xl font-black text-night">{t.auth.loginTitle}</h1>
        <p className="mt-1 text-sm text-slatey">{t.auth.loginSubtitle}</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={signIn} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-night">
            {t.auth.email}
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
            />
          </label>
          <label className="block text-sm font-semibold text-night">
            {t.auth.password}
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
            />
          </label>
          <div className="text-end">
            <Link href="/forgot-password" className="text-xs font-bold text-energy hover:underline">
              {t.auth.forgot}
            </Link>
          </div>
          <SubmitButton className="flex h-11 w-full items-center justify-center rounded-full bg-energy text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {t.auth.submitLogin}
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-slatey">
          {t.auth.noAccount}{' '}
          <Link href="/signup" className="font-bold text-energy hover:underline">
            {t.nav.signup}
          </Link>
        </p>
      </main>
      <BottomNav t={t} active="login" />
    </div>
  )
}
