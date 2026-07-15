# Nova — Playbook production starter

Multi-language, mobile-first **Next.js + Supabase** app scaffolded from Alireza’s production playbook.

## Features

- Public marketing homepage
- Email/password auth (sign up, sign in, forgot/reset password)
- `verifyOtp` confirm route (works across devices)
- User dashboard + profile edit
- Admin user approval list
- 5 locales: EN, TR, RU, FA, HE (RTL for FA/HE)
- RLS-ready `profiles` schema + numbered migrations
- Server Actions, SubmitButton, ConfirmForm patterns

## Quick start

```powershell
cd $env:USERPROFILE\web-app
copy .env.example .env.local
# fill Supabase keys in .env.local
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Windows PowerShell: use `npm.cmd` / `npx.cmd` if execution policy blocks `npm`.

## Project map

```
app/           pages + server actions + auth routes
components/    TopBar, BottomNav, SubmitButton, ConfirmForm, LanguageSwitcher
lib/           supabase clients, i18n, dictionaries, format-date
migrations/    numbered SQL (idempotent)
supabase/      baseline schema snapshot
DEPLOY.md      production deploy steps
HANDOVER.md    AI / session continuity
```

## Supabase

1. Create project
2. Run `migrations/migration1.sql` in SQL Editor
3. Set env vars (see `.env.example`)
4. Follow **DEPLOY.md** for Auth URLs + email templates

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local server |
| `npm run build` | Production build |
| `npm run start` | Serve build |
| `npx tsc --noEmit` | Typecheck |

## Playbook rules (summary)

- Server Components by default
- RLS on every table
- Never edit old migrations
- Never nest forms
- All strings in all 5 dictionaries
- No Redux / Prisma / GraphQL / Auth0
