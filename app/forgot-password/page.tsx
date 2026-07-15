import Link from 'next/link'
import TopBar from '@/components/TopBar'
import SubmitButton from '@/components/SubmitButton'
import { requestPasswordReset } from '@/app/actions/auth'
import { getAppDict } from '@/lib/i18n'

type Props = { searchParams: Promise<{ ok?: string }> }

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { t, locale } = await getAppDict()
  const { ok } = await searchParams

  return (
    <div className="flex min-h-full flex-col">
      <TopBar t={t} locale={locale} />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <h1 className="text-2xl font-black text-night">{t.auth.forgotTitle}</h1>
        <p className="mt-1 text-sm text-slatey">{t.auth.forgotSubtitle}</p>

        {ok ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            {t.auth.forgotSent}
          </div>
        ) : (
          <form action={requestPasswordReset} className="mt-6 space-y-4">
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
            <SubmitButton className="flex h-11 w-full items-center justify-center rounded-full bg-energy text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
              {t.auth.forgotSubmit}
            </SubmitButton>
          </form>
        )}

        <Link href="/login" className="mt-6 text-center text-sm font-bold text-energy hover:underline">
          {t.common.back} · {t.nav.login}
        </Link>
      </main>
    </div>
  )
}
