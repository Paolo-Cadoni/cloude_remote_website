create table if not exists public.waitlist_signups (
  id bigint generated always as identity primary key,
  email text not null unique,
  source text not null default 'website',
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.waitlist_signups enable row level security;

create policy "Allow public inserts into waitlist"
on public.waitlist_signups
for insert
to anon
with check (true);
