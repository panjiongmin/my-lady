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

insert into storage.buckets (id, name, public)
values ('love-site-images', 'love-site-images', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

drop policy if exists "public can read love site images" on storage.objects;
create policy "public can read love site images"
on storage.objects
for select
using (bucket_id = 'love-site-images');

drop policy if exists "public can upload love site images" on storage.objects;
create policy "public can upload love site images"
on storage.objects
for insert
with check (bucket_id = 'love-site-images');

drop policy if exists "public can update love site images" on storage.objects;
create policy "public can update love site images"
on storage.objects
for update
using (bucket_id = 'love-site-images')
with check (bucket_id = 'love-site-images');
