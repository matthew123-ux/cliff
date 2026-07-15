'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm({
  labels,
}: {
  labels: {
    email: string
    password: string
    submit: string
    forgot: string
  }
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    try {
      const form = new FormData(e.currentTarget)
      const email = String(form.get('email') ?? '').trim()
      const password = String(form.get('password') ?? '')

      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setPending(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
          {error.toLowerCase().includes('email not confirmed') && (
            <p className="mt-2 text-xs">
              Your email is not confirmed yet. Turn off &quot;Confirm email&quot; in
              Supabase → Authentication → Providers → Email, or confirm via the
              link in your inbox/spam.
            </p>
          )}
        </div>
      )}

      <label className="block text-sm font-semibold text-night">
        {labels.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="matthewpollak123@gmail.com"
          className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
        />
      </label>
      <label className="block text-sm font-semibold text-night">
        {labels.password}
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
          {labels.forgot}
        </Link>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center rounded-full bg-energy text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? '…' : labels.submit}
      </button>
    </form>
  )
}
