-- Applied 2026-08-13 via the Supabase dashboard (record copy).
-- RLS enabled with no policies on all three tables: anon key fully blocked,
-- all access is server-side via the service role.

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  rate numeric not null default 0,
  payment_method text,
  notes text,
  reminders_enabled boolean not null default true,
  chase_enabled boolean not null default true,
  weekly_day int,      -- 0 = Sunday .. 6 = Saturday; null = no fixed slot
  weekly_time text,    -- "HH:MM", Asia/Jerusalem local time
  weekly_active boolean not null default false,
  intake_submission_id uuid references public.intake_submissions(id)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_min int not null default 50,
  status text not null default 'planned', -- planned | done | canceled
  price numeric not null default 0,       -- snapshot of the patient rate
  note text,
  done_at timestamptz,
  paid_at timestamptz,
  receipt_id text,
  receipt_url text,
  cancel_token uuid not null default gen_random_uuid(),
  reminder_sent_at timestamptz,
  zoom_link_sent_at timestamptz,
  payment_email_sent_at timestamptz,
  chase_sent_at timestamptz
);
create index sessions_patient_idx on public.sessions (patient_id, scheduled_at);
create index sessions_time_idx on public.sessions (scheduled_at);

create table public.site_posts (
  slug text primary key,
  title text not null,
  description text,
  excerpt text,
  body_md text not null default '',
  published boolean not null default true,
  date_published date,
  date_modified date,
  updated_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.sessions enable row level security;
alter table public.site_posts enable row level security;
grant all on public.patients to service_role;
grant all on public.sessions to service_role;
grant all on public.site_posts to service_role;
