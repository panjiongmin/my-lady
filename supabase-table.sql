create table if not exists public.love_site_content (
    site_key text primary key,
    content jsonb not null,
    updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.love_site_content enable row level security;

drop policy if exists "public can read love site content" on public.love_site_content;
create policy "public can read love site content"
on public.love_site_content
for select
using (true);

drop policy if exists "public can insert love site content" on public.love_site_content;
create policy "public can insert love site content"
on public.love_site_content
for insert
with check (true);

drop policy if exists "public can update love site content" on public.love_site_content;
create policy "public can update love site content"
on public.love_site_content
for update
using (true)
with check (true);
