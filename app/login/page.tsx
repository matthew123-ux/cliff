import Link from 'next/link'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import LoginForm from '@/components/LoginForm'
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

        <LoginForm
          labels={{
            email: t.auth.email,
            password: t.auth.password,
            submit: t.auth.submitLogin,
            forgot: t.auth.forgot,
          }}
        />

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
