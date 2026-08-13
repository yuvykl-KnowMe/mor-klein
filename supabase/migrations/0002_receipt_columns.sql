-- Already applied to the live database; recorded here for history.
alter table public.intake_submissions
  add column receipt_id text,
  add column receipt_url text,
  add column receipt_amount text,
  add column receipt_created_at timestamptz;
