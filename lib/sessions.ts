import { supabaseAdmin } from "@/lib/supabase";

// Shared calendar math (Asia/Jerusalem) + the recurring-session generator,
// used by both /admin/week and /api/cron/generate-sessions.

export type Ymd = { y: number; m: number; d: number };

const tzFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jerusalem",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function jerusalemParts(instant: Date) {
  const map: Record<string, string> = {};
  for (const p of tzFormat.formatToParts(instant)) map[p.type] = p.value;
  return {
    y: +map.year,
    m: +map.month,
    d: +map.day,
    h: +map.hour % 24, // some engines render midnight as "24"
    mi: +map.minute,
    s: +map.second,
  };
}

/** Israel calendar date of a UTC instant. */
export function jerusalemYmd(instant: Date): Ymd {
  const { y, m, d } = jerusalemParts(instant);
  return { y, m, d };
}

/**
 * UTC instant for an Asia/Jerusalem wall-clock time. DST-correct: computes the
 * zone offset at the target instant itself (two-pass, converges across
 * transitions). No dependencies — Intl only.
 */
export function zonedToUtc(
  y: number,
  m: number,
  d: number,
  h: number,
  mi: number,
): Date {
  const wallTarget = Date.UTC(y, m - 1, d, h, mi);
  let ts = wallTarget;
  for (let i = 0; i < 2; i++) {
    const p = jerusalemParts(new Date(ts));
    const wall = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
    ts = wallTarget - (wall - ts); // offset = wall - ts
  }
  return new Date(ts);
}

/** Pure calendar-date arithmetic (no timezone involved). */
export function addDays(d: Ymd, n: number): Ymd {
  const t = new Date(Date.UTC(d.y, d.m - 1, d.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

/** 0 = Sunday .. 6 = Saturday, for a calendar date. */
export function dayOfWeek(d: Ymd): number {
  return new Date(Date.UTC(d.y, d.m - 1, d.d)).getUTCDay();
}

export function ymdString(d: Ymd): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.y}-${pad(d.m)}-${pad(d.d)}`;
}

export function parseYmd(s: string): Ymd | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = { y: +m[1], m: +m[2], d: +m[3] };
  // Round-trip rejects impossible dates like 2026-02-31.
  return ymdString(addDays(d, 0)) === s ? d : null;
}

const HORIZON_WEEKS = 4;

/**
 * Ensure every weekly-active patient has a planned session for each of the
 * next HORIZON_WEEKS occurrences of their weekly slot. Idempotent: a week
 * (Sunday–Saturday, Israel time) that already holds ANY session for the
 * patient — planned, done, or canceled — is skipped, which respects both
 * manually moved sessions and cancellations.
 * Returns the number of sessions inserted.
 */
export async function generatePlannedSessions(): Promise<number> {
  const { data: patients, error } = await supabaseAdmin
    .from("patients")
    .select("id, rate, weekly_day, weekly_time")
    .eq("weekly_active", true)
    .not("weekly_day", "is", null)
    .not("weekly_time", "is", null);
  if (error) throw new Error(error.message);
  if (!patients || patients.length === 0) return 0;

  const now = new Date();
  const today = jerusalemYmd(now);
  const weekStart = addDays(today, -dayOfWeek(today)); // this week's Sunday
  // Occurrences reach at most today+13 (slot passed today) + 3 more weeks.
  const rangeEndDay = addDays(weekStart, (HORIZON_WEEKS + 2) * 7);
  const rangeStart = zonedToUtc(weekStart.y, weekStart.m, weekStart.d, 0, 0);
  const rangeEnd = zonedToUtc(rangeEndDay.y, rangeEndDay.m, rangeEndDay.d, 0, 0);

  // Canceled sessions COUNT as handled: canceling means "no session that
  // week". Excluding them here made cancel re-trigger the generator on the
  // next render, spawning an endless run of canceled + fresh planned rows.
  const { data: existing, error: exErr } = await supabaseAdmin
    .from("sessions")
    .select("patient_id, scheduled_at")
    .gte("scheduled_at", rangeStart.toISOString())
    .lt("scheduled_at", rangeEnd.toISOString())
    .in(
      "patient_id",
      patients.map((p) => p.id),
    );
  if (exErr) throw new Error(exErr.message);

  // "patientId|weekSunday" keys of weeks that already have a session.
  const taken = new Set<string>();
  for (const s of existing ?? []) {
    const day = jerusalemYmd(new Date(s.scheduled_at));
    const sunday = addDays(day, -dayOfWeek(day));
    taken.add(`${s.patient_id}|${ymdString(sunday)}`);
  }

  const inserts: {
    patient_id: string;
    scheduled_at: string;
    duration_min: number;
    price: number;
  }[] = [];
  for (const p of patients) {
    const tm = /^(\d{1,2}):(\d{2})$/.exec(String(p.weekly_time ?? ""));
    if (!tm || p.weekly_day == null) continue;
    const h = +tm[1];
    const mi = +tm[2];
    // First occurrence of weekly_day from today forward.
    let day = addDays(today, (p.weekly_day - dayOfWeek(today) + 7) % 7);
    if (zonedToUtc(day.y, day.m, day.d, h, mi) < now) day = addDays(day, 7);
    for (let k = 0; k < HORIZON_WEEKS; k++) {
      const occ = addDays(day, k * 7);
      const sunday = addDays(occ, -dayOfWeek(occ));
      const key = `${p.id}|${ymdString(sunday)}`;
      if (taken.has(key)) continue;
      taken.add(key);
      inserts.push({
        patient_id: p.id,
        scheduled_at: zonedToUtc(occ.y, occ.m, occ.d, h, mi).toISOString(),
        duration_min: 50,
        price: Number(p.rate) || 0,
      });
    }
  }

  if (inserts.length === 0) return 0;
  // ponytail: not race-safe if two calls overlap; fine for a single-admin
  // cron + page render. Add a unique partial index if it ever matters.
  const { error: insErr } = await supabaseAdmin.from("sessions").insert(inserts);
  if (insErr) throw new Error(insErr.message);
  return inserts.length;
}
