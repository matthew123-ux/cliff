# Deploy — Nova (web-app)

Follow this order every time the database changes.

## 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Region: closest to users
3. Copy **Project URL**, **anon key**, **service_role key**

## 2. Run migration

1. Open Supabase → **SQL Editor**
2. Paste `migrations/migration1.sql` → **Run**
3. Verify:

```sql
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'profiles';
```

## 3. Auth URLs

Supabase → **Authentication** → **URL Configuration**:

- Site URL: `https://yourdomain.com` (or `http://localhost:3000` for local)
- Redirect URLs:
  - `http://localhost:3000/auth/confirm`
  - `https://yourdomain.com/auth/confirm`
  - `http://localhost:3000/auth/callback`
  - `https://yourdomain.com/auth/callback`

### Reset password email template

Authentication → Email Templates → **Reset password** body link:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">
  Reset password
</a>
```

Confirm signup template: use `type=signup` and `next=/dashboard`.

## 4. First admin (automatic)

`matthewpollak123@gmail.com` is auto-promoted to `super_admin` + `approved` by the signup trigger in migration1.

No manual SQL after signup. If that account already exists without admin:

- Run `migrations/migration2.sql` once (backfills + updates the trigger).

## 5. Vercel

1. Push repo to GitHub
2. Import on Vercel
3. Env vars:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (**no** `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SITE_URL` | production URL |

4. Deploy. Auto-deploys on every push to `main`.

## 6. Custom domain (optional)

1. Cloudflare DNS for the domain
2. Vercel → Domains → add domain
3. Add CNAME/A as Vercel instructs
4. SSL is automatic

## 7. Production email (Resend)

Default Supabase SMTP is rate-limited. For production:

1. Resend account + verified domain
2. Supabase → Auth → SMTP: `smtp.resend.com`, port `465`, user `resend`, password = API key
3. Sender: `noreply@yourdomain.com`

## Deploy checklist

- [ ] Migration ran in SQL Editor
- [ ] Env vars set on Vercel
- [ ] Redirect URLs include `/auth/confirm`
- [ ] Email templates use `token_hash` + `verifyOtp`
- [ ] First user promoted to `super_admin`
- [ ] Smoke test: signup → email confirm → login → dashboard → admin
