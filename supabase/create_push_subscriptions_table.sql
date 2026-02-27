-- Web Push Subscriptions fuer mobile/background Benachrichtigungen

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions(user_id);

create index if not exists push_subscriptions_user_name_idx
  on public.push_subscriptions(user_name);

create or replace function public.set_push_subscriptions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_push_subscriptions_updated_at on public.push_subscriptions;
create trigger trg_push_subscriptions_updated_at
before update on public.push_subscriptions
for each row execute function public.set_push_subscriptions_updated_at();

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users can view own push subscriptions" on public.push_subscriptions;
create policy "Users can view own push subscriptions"
  on public.push_subscriptions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own push subscriptions" on public.push_subscriptions;
create policy "Users can insert own push subscriptions"
  on public.push_subscriptions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own push subscriptions" on public.push_subscriptions;
create policy "Users can update own push subscriptions"
  on public.push_subscriptions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own push subscriptions" on public.push_subscriptions;
create policy "Users can delete own push subscriptions"
  on public.push_subscriptions
  for delete
  using (auth.uid() = user_id);
