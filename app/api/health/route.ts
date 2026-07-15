import { NextResponse } from 'next/server'

/** Public diagnostic — does NOT expose secret values */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  let authReachable = false
  let authError: string | null = null

  if (url && anon) {
    try {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        cache: 'no-store',
      })
      authReachable = res.ok
      if (!res.ok) authError = `auth health ${res.status}`
    } catch (e) {
      authError = e instanceof Error ? e.message : 'fetch failed'
    }
  }

  return NextResponse.json({
    ok: Boolean(url && anon && authReachable),
    hasSupabaseUrl: Boolean(url),
    hasAnonKey: Boolean(anon),
    hasServiceRoleKey: Boolean(service),
    supabaseHost: url ? new URL(url).host : null,
    authReachable,
    authError,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  })
}
