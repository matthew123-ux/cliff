import TopBar from '@/components/TopBar'
import SubmitButton from '@/components/SubmitButton'
import { updatePassword } from '@/app/actions/auth'
import { getAppDict } from '@/lib/i18n'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { t, locale } = await getAppDict()
  const { error } = await searchParams

  return (
    <div className="flex min-h-full flex-col">
      <TopBar t={t} locale={locale} />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <h1 className="text-2xl font-black text-night">{t.auth.resetTitle}</h1>
        <p className="mt-1 text-sm text-slatey">{t.auth.resetSubtitle}</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={updatePassword} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-night">
            {t.auth.newPassword}
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
            />
          </label>
          <label className="block text-sm font-semibold text-night">
            {t.auth.confirmPassword}
            <input
              name="confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
            />
          </label>
          <SubmitButton className="flex h-11 w-full items-center justify-center rounded-full bg-energy text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {t.auth.resetSubmit}
          </SubmitButton>
        </form>
      </main>
    </div>
  )
}
