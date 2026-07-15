'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const first_name = String(formData.get('first_name') ?? '').trim()
  const last_name = String(formData.get('last_name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()

  const { error } = await supabase
    .from('profiles')
    .update({ first_name, last_name, phone, bio })
    .eq('id', user.id)

  if (error) {
    // Schema-drift safety: retry without optional columns
    if (error.code === '42703') {
      await supabase
        .from('profiles')
        .update({ first_name, last_name })
        .eq('id', user.id)
    } else {
      redirect(`/dashboard?error=${encodeURIComponent(error.message)}`)
    }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?ok=saved')
}
