'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupForm({
  labels,
}: {
  labels: {
    firstName: string
    lastName: string
    email: string
    password: string
    submit: string
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
      const firstName = String(form.get('first_name') ?? '').trim()
      const lastName = String(form.get('last_name') ?? '').trim()

      const supabase = createClient()
      const origin = window.location.origin

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
          data: { first_name: firstName, last_name: lastName },
        },
      })

      if (authError) {
        setError(authError.message)
        setPending(false)
        return
      }

      // If email confirm is off, session exists → go to dashboard
      if (data.session) {
        router.push('/dashboard')
        router.refresh()
        return
      }

      router.push('/signup/success')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold text-night">
          {labels.firstName}
          <input
            name="first_name"
            required
            autoComplete="given-name"
            className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
          />
        </label>
        <label className="block text-sm font-semibold text-night">
          {labels.lastName}
          <input
            name="last_name"
            required
            autoComplete="family-name"
            className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
          />
        </label>
      </div>
      <label className="block text-sm font-semibold text-night">
        {labels.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
        />
      </label>
      <label className="block text-sm font-semibold text-night">
        {labels.password}
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-xl border border-mist-2 bg-white px-3 py-2.5 text-sm outline-none focus:border-energy"
        />
      </label>
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
