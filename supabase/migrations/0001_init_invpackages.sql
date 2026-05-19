-- Schema for Invensis course packages persistence
-- Run this against your self-hosted Supabase Postgres.

create schema if not exists invpackages;

-- Expose the schema to the PostgREST API used by supabase-js.
-- Self-hosted Supabase exposes only `public` by default; we need this
-- so that .schema('invpackages') queries return rows instead of 404.
grant usage on schema invpackages to anon, authenticated, service_role;
alter default privileges in schema invpackages
  grant all on tables to service_role;
alter default privileges in schema invpackages
  grant select on tables to anon, authenticated;

create table if not exists invpackages.courses (
  id              text primary key,
  slug            text not null unique,
  title           text not null,
  eyebrow         text not null default '',
  subtitle        text not null default '',
  description     text not null default '',
  pass_rate       text not null default '',
  course_category text not null default 'Project Management',
  packages        jsonb not null default '[]'::jsonb,
  exam_specs      jsonb,
  is_custom       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists courses_slug_idx on invpackages.courses (slug);
create index if not exists courses_is_custom_idx on invpackages.courses (is_custom);

-- Keep updated_at fresh on every UPDATE.
create or replace function invpackages.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists courses_set_updated_at on invpackages.courses;
create trigger courses_set_updated_at
  before update on invpackages.courses
  for each row execute function invpackages.set_updated_at();

-- RLS: server uses the service role key, which bypasses RLS.
-- We still enable RLS so the anon key cannot read/write directly
-- if someone exposes the schema later.
alter table invpackages.courses enable row level security;

-- Grant table-level privileges to service_role explicitly (in addition
-- to default privileges above, which only apply to future tables).
grant all on invpackages.courses to service_role;
