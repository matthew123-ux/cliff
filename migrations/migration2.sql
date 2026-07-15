-- =====================================================================
--  Migration 2 — Auto-promote primary admin on signup
--
--  WHAT this changes:
--   - Updates handle_new_user() so matthewpollak123@gmail.com becomes
--     super_admin + approved automatically
--   - Backfills that email if the profile already exists
--
--  WHY:
--   - Avoids running a manual UPDATE after first signup
--
--  Idempotent. Safe to re-run.
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_role   text := 'user';
  v_status text := 'pending';
begin
  if lower(coalesce(new.email, '')) = 'matthewpollak123@gmail.com' then
    v_role := 'super_admin';
    v_status := 'approved';
  end if;

  insert into public.profiles (id, email, first_name, last_name, role, status)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    v_role,
    v_status
  )
  on conflict (id) do update set
    email = excluded.email,
    role = case
      when lower(coalesce(excluded.email, '')) = 'matthewpollak123@gmail.com'
        then 'super_admin'
      else public.profiles.role
    end,
    status = case
      when lower(coalesce(excluded.email, '')) = 'matthewpollak123@gmail.com'
        then 'approved'
      else public.profiles.status
    end;

  return new;
end $$;

-- If you already signed up before this migration, promote now:
update public.profiles
set role = 'super_admin', status = 'approved'
where lower(email) = 'matthewpollak123@gmail.com';

notify pgrst, 'reload schema';
