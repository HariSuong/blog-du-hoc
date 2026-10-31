-- Schema ebooks + storage bucket blog-files
-- Chạy trên Supabase SQL Editor nếu chưa tạo.

create table if not exists public.ebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  cover_image_url text,
  file_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists ebooks_created_at_idx on public.ebooks (created_at desc);

alter table public.ebooks enable row level security;

-- Public đọc
drop policy if exists "ebooks_select_public" on public.ebooks;
create policy "ebooks_select_public"
  on public.ebooks for select
  to anon, authenticated
  using (true);

-- Chỉ authenticated mới ghi
drop policy if exists "ebooks_insert_auth" on public.ebooks;
create policy "ebooks_insert_auth"
  on public.ebooks for insert
  to authenticated
  with check (true);

drop policy if exists "ebooks_update_auth" on public.ebooks;
create policy "ebooks_update_auth"
  on public.ebooks for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "ebooks_delete_auth" on public.ebooks;
create policy "ebooks_delete_auth"
  on public.ebooks for delete
  to authenticated
  using (true);

-- Bucket blog-files (PDF): tạo qua Dashboard Storage nếu chưa có,
-- bật Public, cho phép MIME application/pdf.
-- Policy gợi ý (Storage):
-- SELECT: public
-- INSERT/UPDATE/DELETE: authenticated
