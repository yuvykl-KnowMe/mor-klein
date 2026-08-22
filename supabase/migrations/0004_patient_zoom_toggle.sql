-- Record copy; apply via the Supabase dashboard SQL editor.
-- Per-patient toggle for the Zoom-link email (and the Zoom line inside the
-- session reminder). Off for in-person patients.

alter table public.patients
  add column zoom_enabled boolean not null default true;

-- The zoom email was previously gated on reminders_enabled; carry that
-- choice over so opted-out patients don't silently start getting it.
update public.patients set zoom_enabled = reminders_enabled;
