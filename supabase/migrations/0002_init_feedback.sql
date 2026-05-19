-- Per-course SME feedback thread.
-- Lives in the `public` schema (already exposed by PostgREST) with an
-- `invpackages_` prefix to namespace it away from other tables on this
-- shared Supabase instance.
--
-- Touches: one table, one index, RLS settings on the new table.
-- Touches nothing else — no other schemas, tables, roles, or policies
-- on this Supabase instance are modified.

create extension if not exists "pgcrypto";

create table if not exists public.invpackages_feedback (
  id         uuid primary key default gen_random_uuid(),
  course_id  text not null,
  name       text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists invpackages_feedback_course_id_idx
  on public.invpackages_feedback (course_id, created_at desc);

-- RLS on. The Next.js API routes hit Supabase with the service role
-- key, which bypasses RLS. The anon key cannot read/write this table
-- without an explicit policy (which we deliberately do NOT add).
alter table public.invpackages_feedback enable row level security;

grant all on public.invpackages_feedback to service_role;
