-- Tham chiếu schema comments (đã tồn tại trên Supabase project).
-- Cột: id, post_id, parent_id, author_name, author_email, content, created_at

/*
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  author_name text not null,
  author_email text,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists comments_parent_id_idx on public.comments (parent_id);

alter table public.comments enable row level security;

-- SELECT: công khai
-- INSERT: công khai (anon + authenticated)
-- Không cho UPDATE/DELETE từ client
*/
