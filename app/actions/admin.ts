'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const role = (profile as { role?: string } | null)?.role
  if (role !== 'admin' && role !== 'super_admin') {
    redirect('/dashboard?error=forbidden')
  }

  return { supabase, user, profile }
}

export async function setUserStatus(formData: FormData) {
  const { supabase } = await requireAdmin()
  const userId = String(formData.get('userId') ?? '')
  const status = String(formData.get('status') ?? '')

  if (!userId || !['approved', 'rejected', 'pending'].includes(status)) {
    redirect('/admin?error=invalid')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin')
  redirect(`/admin?ok=${status}`)
}
