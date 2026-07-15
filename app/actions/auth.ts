'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { siteOrigin } from '@/lib/site'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const firstName = String(formData.get('first_name') ?? '').trim()
  const lastName = String(formData.get('last_name') ?? '').trim()
  const origin = await siteOrigin()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  redirect('/signup/success')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '').trim()
  const origin = await siteOrigin()

  // Always redirect to success UI to avoid email enumeration
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  })

  redirect('/forgot-password?ok=1')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (!password || password.length < 8) {
    redirect(`/reset-password?error=${encodeURIComponent('Password must be at least 8 characters')}`)
  }
  if (password !== confirm) {
    redirect(`/reset-password?error=${encodeURIComponent('Passwords do not match')}`)
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)

  redirect('/dashboard?ok=password')
}
