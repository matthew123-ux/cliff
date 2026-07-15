import { redirect } from 'next/navigation'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import ConfirmForm from '@/components/ConfirmForm'
import { setUserStatus } from '@/app/actions/admin'
import { getAppDict } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/format-date'
import Link from 'next/link'

type Props = { searchParams: Promise<{ status?: string; error?: string; ok?: string }> }

type Profile = {
  id: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  role?: string | null
  status?: string | null
  created_at?: string | null
}

export default async function AdminPage({ searchParams }: Props) {
  const { t, locale } = await getAppDict()
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  const me = meRaw as Profile | null
  const isAdmin = me?.role === 'admin' || me?.role === 'super_admin'

  if (!isAdmin) {
    return (
      <div className="flex min-h-full flex-col pb-20 sm:pb-0">
        <TopBar t={t} locale={locale} userEmail={user.email} />
        <main className="mx-auto max-w-lg flex-1 px-4 py-16 text-center">
          <h1 className="text-xl font-black text-night">{t.admin.forbidden}</h1>
          <Link href="/dashboard" className="mt-4 inline-block font-bold text-energy">
            {t.nav.dashboard}
          </Link>
        </main>
        <BottomNav t={t} isAuthed />
      </div>
    )
  }

  const statusFilter = params.status
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100)
  if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
    query = query.eq('status', statusFilter)
  }
  const { data: usersRaw } = await query
  const users = (usersRaw ?? []) as Profile[]

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.status === 'pending').length,
    approved: users.filter((u) => u.status === 'approved').length,
    rejected: users.filter((u) => u.status === 'rejected').length,
  }

  // If filtering, recount from full set would need another query — good enough for starter
  const subTabs = [
    { id: 'all', label: t.admin.users, href: '/admin', count: counts.all, color: 'bg-slatey-2' },
    { id: 'pending', label: 'pending', href: '/admin?status=pending', count: counts.pending, color: 'bg-gold' },
    { id: 'approved', label: 'approved', href: '/admin?status=approved', count: counts.approved, color: 'bg-emerald-400' },
    { id: 'rejected', label: 'rejected', href: '/admin?status=rejected', count: counts.rejected, color: 'bg-red-400' },
  ]
  const active = statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter) ? statusFilter : 'all'

  return (
    <div className="flex min-h-full flex-col pb-20 sm:pb-0">
      <TopBar t={t} locale={locale} userEmail={user.email} isAdmin />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-black text-night">{t.admin.title}</h1>
        <p className="mt-1 text-sm text-slatey">{t.admin.subtitle}</p>

        {params.error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </div>
        )}

        <div className="mb-4 mt-6 flex items-center gap-2 overflow-x-auto">
          {subTabs.map((s) => {
            const isActive = active === s.id
            return (
              <Link
                key={s.id}
                href={s.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
                  isActive
                    ? 'bg-night text-white'
                    : 'border border-mist-2 bg-white text-slatey'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                {s.label}
                <span className="ms-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-mist px-1 text-[10px] font-black text-night">
                  {s.count}
                </span>
              </Link>
            )
          })}
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-slatey">{t.admin.empty}</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => {
              const name =
                [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || u.id
              const stripe =
                u.status === 'approved'
                  ? 'before:bg-emerald-400'
                  : u.status === 'rejected'
                    ? 'before:bg-red-400'
                    : 'before:bg-gold'
              return (
                <li
                  key={u.id}
                  className={`relative overflow-hidden rounded-2xl border border-mist-2 bg-white shadow-sm before:absolute before:bottom-0 before:start-0 before:top-0 before:w-1.5 ${stripe}`}
                >
                  <div className="p-4 ps-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-black text-night">{name}</div>
                        <div className="text-sm text-slatey">{u.email}</div>
                        <div className="mt-1 text-xs text-slatey-2">
                          {t.admin.role}: {u.role ?? 'user'} · {t.admin.status}:{' '}
                          {u.status ?? 'pending'}
                          {u.created_at ? ` · ${formatDate(u.created_at, locale)}` : ''}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ConfirmForm
                          action={setUserStatus}
                          message={`Approve ${name}?`}
                          className="inline"
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="status" value="approved" />
                          <button
                            type="submit"
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"
                          >
                            {t.admin.approve}
                          </button>
                        </ConfirmForm>
                        <ConfirmForm
                          action={setUserStatus}
                          message={`Reject ${name}?`}
                          className="inline"
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600"
                          >
                            {t.admin.reject}
                          </button>
                        </ConfirmForm>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      <BottomNav t={t} active="admin" isAuthed showAdmin />
    </div>
  )
}
