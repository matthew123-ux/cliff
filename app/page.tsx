import Link from 'next/link'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { getAppDict } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const { t, locale } = await getAppDict()

  let userEmail: string | null = null
  let isAdmin = false

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userEmail = user?.email ?? null
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      const role = (profile as { role?: string } | null)?.role
      isAdmin = role === 'admin' || role === 'super_admin'
    }
  } catch {
    /* missing env during first run */
  }

  const features = [
    { title: t.home.feature1Title, body: t.home.feature1Body },
    { title: t.home.feature2Title, body: t.home.feature2Body },
    { title: t.home.feature3Title, body: t.home.feature3Body },
  ]

  return (
    <div className="flex min-h-full flex-col pb-20 sm:pb-0">
      <TopBar t={t} locale={locale} userEmail={userEmail} isAdmin={isAdmin} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mist-2 bg-white px-3 py-1 text-xs font-bold text-slatey">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t.home.badge}
        </div>

        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-night sm:text-5xl">
          {t.home.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slatey sm:text-lg">
          {t.home.subtitle}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={userEmail ? '/dashboard' : '/signup'}
            className="inline-flex h-12 items-center justify-center rounded-full bg-energy px-6 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
          >
            {userEmail ? t.nav.dashboard : t.home.ctaPrimary}
          </Link>
          {!userEmail && (
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-mist-2 bg-white px-6 text-sm font-bold text-night hover:bg-mist"
            >
              {t.home.ctaSecondary}
            </Link>
          )}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="relative overflow-hidden rounded-2xl border border-mist-2 bg-white p-5 shadow-sm before:absolute before:bottom-0 before:start-0 before:top-0 before:w-1.5 before:bg-energy"
            >
              <h2 className="ps-2 text-lg font-black text-night">{f.title}</h2>
              <p className="mt-2 ps-2 text-sm leading-relaxed text-slatey">{f.body}</p>
            </article>
          ))}
        </div>
      </main>

      <BottomNav t={t} active="home" isAuthed={!!userEmail} showAdmin={isAdmin} />
    </div>
  )
}
