-- =====================================================================
--  ONE-TIME SETUP — paste entire file into Supabase SQL Editor → Run
--  Project: uepoomodlwsyorfxoeyy
--  Idempotent. Safe to re-run.
-- =====================================================================

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  first_name   text,
  last_name    text,
  email        text,
  phone        text,
  role         text not null default 'user',
  status       text not null default 'pending',
  type         text not null default 'nonresident',
  avatar_url   text,
  bio          text,
  player_code  text unique,
  level        numeric(3,2) default 2.0,
  created_at   timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','super_admin')
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  using (id = auth.uid());

drop policy if exists "profiles admin write" on public.profiles;
create policy "profiles admin write"
  on public.profiles for all
  using (public.is_admin());

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

update public.profiles
set role = 'super_admin', status = 'approved'
where lower(email) = 'matthewpollak123@gmail.com';

notify pgrst, 'reload schema';
