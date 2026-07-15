# HANDOVER — web-app (Alireza Playbook starter)

**Date:** 2026-07-15  
**Project path:** `C:\Users\Owner\web-app`  
**GitHub:** https://github.com/matthew123-ux/cliff.git  
**Live:** https://cliff-eta.vercel.app  
**Status:** Deployed. Supabase SQL done.  
**Next:** Auth URL config in Supabase + set NEXT_PUBLIC_SITE_URL on Vercel + smoke test signup.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- `@supabase/ssr` + `@supabase/supabase-js`
- i18n: `en`, `tr`, `ru`, `fa`, `he` (RTL for fa/he)
- Deploy target: Vercel + Supabase + Cloudflare (see DEPLOY.md)

## What exists

| Area | Location |
|------|----------|
| Marketing home | `app/page.tsx` |
| Auth pages | `login`, `signup`, `forgot-password`, `reset-password` |
| Auth actions | `app/actions/auth.ts` |
| verifyOtp confirm | `app/auth/confirm/route.ts` |
| Dashboard + profile update | `app/dashboard/page.tsx`, `app/actions/profile.ts` |
| Admin approve/reject | `app/admin/page.tsx`, `app/actions/admin.ts` |
| Supabase clients | `lib/supabase/{server,client,admin}.ts` |
| i18n | `lib/i18n.ts`, `lib/dict-app-*.ts` |
| UI primitives | `components/{TopBar,BottomNav,SubmitButton,ConfirmForm,LanguageSwitcher}.tsx` |
| Baseline SQL | `migrations/migration1.sql`, `supabase/schema.sql` |

## Rules (do not break)

1. Server Components by default — `'use client'` only for state / browser APIs / form status
2. Never nest forms
3. Never edit already-run migrations — add `migrationN+1.sql`
4. Never put service role key in `NEXT_PUBLIC_*`
5. Every new UI string → all 5 dictionaries
6. Prefer Server Actions over API routes
7. Schema-drift: `select('*')` + optional field access when adding columns

## Next steps for human / next AI session

1. Create Supabase project; copy keys into `.env.local`
2. Run `migrations/migration1.sql` in SQL Editor
3. Configure Auth redirect URLs + email templates (DEPLOY.md)
4. `npm.cmd run dev` → smoke test auth
5. Sign up with `matthewpollak123@gmail.com` — auto-promoted to super_admin (migration1/2)
6. Domain-specific features (bookings, etc.) as new migrations + `app/actions/*`

**Admin promote is automatic** for `matthewpollak123@gmail.com` in `handle_new_user()`.
If you already signed up before that logic: run `migrations/migration2.sql`.

## Local commands

```powershell
cd $env:USERPROFILE\web-app
npm.cmd run dev
npx.cmd tsc --noEmit
npm.cmd run build
```

## Known placeholders

- Brand name **Nova** — replace in dictionaries
- `.env.local` has dummy Supabase URL/keys
- Translations marked `// TODO: verify translation` for non-English
