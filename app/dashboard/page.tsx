import { redirect } from 'next/navigation'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import SubmitButton from '@/components/SubmitButton'
import { updateProfile } from '@/app/actions/profile'
import { getAppDict } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/format-date'

type Props = { searchParams: Promise<{ error?: string; ok?: string }> }

type Profile = {
  id: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  bio?: string | null
  role?: string | null
  status?: string | null
  created_at?: string | null
}

export default async function DashboardPage({ searchParams }: Props) {
  const { t, locale } = await getAppDict()
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const profile = data as Profile | null
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user.email ||
    'there'

  const status = profile?.status ?? 'pending'
  const statusCopy =
    status === 'approved'
      ? t.dashboard.approved
      : status === 'rejected'
        ? t.dashboard.rejected
        : t.dashboard.pending

  const stripe =
    status === 'approved'
      ? 'before:bg-emerald-400'
      : status === 'rejected'
        ? 'before:bg-red-400'
        : 'before:bg-gold'

  return (
    <div className="flex min-h-full flex-col pb-20 sm:pb-0">
      <TopBar t={t} locale={locale} userEmail={user.email} isAdmin={isAdmin} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-black text-night">{t.dashboard.title}</h1>
        <p className="mt-1 text-slatey">
          {t.dashboard.welcome.replace('{name}', name)}
        </p>

        {params.error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </div>
        )}
        {params.ok && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {params.ok}
          </div>
        )}

        <div
          className={`relative mt-6 overflow-hidden rounded-2xl border border-mist-2 bg-white p-5 shadow-sm before:absolute before:bottom-0 before:start-0 before:top-0 before:w-1.5 ${stripe}`}
        >
          {!profile ? (
            <p className="ps-2 text-sm text-slatey">{t.dashboard.noProfile}</p>
          ) : (
            <div className="ps-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-lg font-black text-night">{name}</div>
                  <div className="text-sm text-slatey">{profile.email ?? user.email}</div>
                </div>
                <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slatey">
                  {status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slatey">{statusCopy}</p>
              {profile.created_at && (
                <p className="mt-2 text-xs text-slatey-2">
                  {formatDate(profile.created_at, locale)}
                </p>
              )}
            </div>
          )}
        </div>

        <form action={updateProfile} className="mt-6 space-y-4 rounded-2xl border border-mist-2 bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-night">
              {t.auth.firstName}
              <input
                name="first_name"
                defaultValue={profile?.first_name ?? ''}
                className="mt-1 w-full rounded-xl border border-mist-2 px-3 py-2.5 text-sm outline-none focus:border-energy"
              />
            </label>
            <label className="block text-sm font-semibold text-night">
              {t.auth.lastName}
              <input
                name="last_name"
                defaultValue={profile?.last_name ?? ''}
                className="mt-1 w-full rounded-xl border border-mist-2 px-3 py-2.5 text-sm outline-none focus:border-energy"
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-night">
            Phone
            <input
              name="phone"
              defaultValue={profile?.phone ?? ''}
              className="mt-1 w-full rounded-xl border border-mist-2 px-3 py-2.5 text-sm outline-none focus:border-energy"
            />
          </label>
          <label className="block text-sm font-semibold text-night">
            Bio
            <textarea
              name="bio"
              rows={3}
              defaultValue={profile?.bio ?? ''}
              className="mt-1 w-full rounded-xl border border-mist-2 px-3 py-2.5 text-sm outline-none focus:border-energy"
            />
          </label>
          <SubmitButton className="inline-flex h-11 items-center justify-center rounded-full bg-energy px-6 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {t.common.save}
          </SubmitButton>
        </form>
      </main>

      <BottomNav t={t} active="dashboard" isAuthed showAdmin={isAdmin} />
    </div>
  )
}
