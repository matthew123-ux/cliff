import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/** Legacy PKCE code exchange — prefer /auth/confirm with verifyOtp */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, url.origin))
  }

  return NextResponse.redirect(new URL('/login?error=invalid', url.origin))
}
