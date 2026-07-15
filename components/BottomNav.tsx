import Link from 'next/link'
import type { AppDict } from '@/lib/dict-types'

type Props = {
  t: AppDict
  active?: 'home' | 'dashboard' | 'admin' | 'login'
  showAdmin?: boolean
  isAuthed?: boolean
}

export default function BottomNav({ t, active, showAdmin, isAuthed }: Props) {
  const item = (href: string, key: string, label: string) => {
    const isActive = active === key
    return (
      <Link
        href={href}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-bold ${
          isActive ? 'text-energy' : 'text-slatey'
        }`}
      >
        <span
          className={`h-1 w-6 rounded-full ${isActive ? 'bg-energy' : 'bg-transparent'}`}
        />
        {label}
      </Link>
    )
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-mist-2 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-lg">
        {item('/', 'home', t.nav.home)}
        {isAuthed
          ? item('/dashboard', 'dashboard', t.nav.dashboard)
          : item('/login', 'login', t.nav.login)}
        {showAdmin && item('/admin', 'admin', t.nav.admin)}
      </div>
    </nav>
  )
}
