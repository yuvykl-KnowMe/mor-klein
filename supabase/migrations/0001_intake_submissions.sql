create table public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  age text,
  gender text,
  email text,
  occupation text,
  marital_status text,
  hospitalization text,
  medication text,
  reason text,
  expectations text,
  status text not null default 'new',
  admin_note text
);
alter table public.intake_submissions enable row level security;
-- no policies: anon key blocked entirely; all access via service role
