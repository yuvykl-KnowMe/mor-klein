import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sessionToken } from "@/lib/adminSession";
import {
  sendPaymentRequest,
  sendSessionReminder,
  sendZoomLink,
  type SendOutcome,
} from "@/lib/notify";
import {
  addDays,
  dayOfWeek,
  generatePlannedSessions,
  jerusalemYmd,
  parseYmd,
  ymdString,
  zonedToUtc,
  type Ymd,
} from "@/lib/sessions";
import { supabaseAdmin } from "@/lib/supabase";
import ConfirmButton from "../ConfirmButton";
import { CopyButton, NewSessionForm, type PatientOption } from "./ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "יומן שבועי",
  robots: { index: false, follow: false },
};

const buttonClass =
  "rounded-lg bg-accent-deep px-3 py-1.5 text-sm text-on-accent hover:bg-accent-deeper";
const quietButtonClass =
  "rounded-lg border border-line bg-surface px-3 py-1.5 text-sm hover:bg-sand";

type SessionRow = {
  id: string;
  scheduled_at: string;
  duration_min: number;
  status: string;
  price: number;
  patient_id: string;
  paid_at: string | null;
  reminder_sent_at: string | null;
  zoom_link_sent_at: string | null;
  payment_email_sent_at: string | null;
  patients:
    | { name: string; email: string | null }
    | { name: string; email: string | null }[]
    | null;
};

const timeFormat = new Intl.DateTimeFormat("he-IL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jerusalem",
});

// For datetime-local values: "YYYY-MM-DDTHH:MM" in Israel local time.
const localInputFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Jerusalem",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const dayHeadFormat = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const rangeFormat = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function calDate(d: Ymd): Date {
  return new Date(Date.UTC(d.y, d.m - 1, d.d));
}

function patientOf(row: SessionRow) {
  return Array.isArray(row.patients) ? row.patients[0] : row.patients;
}

function patientName(row: SessionRow): string {
  return patientOf(row)?.name ?? "מטופל/ת";
}

function statusBadge(status: string) {
  if (status === "done") {
    return (
      <span className="inline-block rounded-full border border-line bg-sand px-3 py-0.5 text-sm text-ink-muted">
        בוצעה
      </span>
    );
  }
  if (status === "canceled") {
    return (
      <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-sm text-red-700">
        בוטלה
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-accent-deep px-3 py-0.5 text-sm text-on-accent">
      מתוכננת
    </span>
  );
}

/** "YYYY-MM-DDTHH:MM" (Israel local, from datetime-local) -> UTC instant. */
function parseLocalInput(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!m) return null;
  return zonedToUtc(+m[1], +m[2], +m[3], +m[4], +m[5]);
}

// "בוצעה" only records the fact — it never emails anyone. Payment requests
// go out via the explicit button below (emailPaymentRequest).
async function markDone(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin
    .from("sessions")
    .update({ status: "done", done_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/week");
}

/** Redirect back to the week view with a mail_ok/mail_error banner. */
function mailRedirect(week: string, outcome: SendOutcome): never {
  const base = week ? `/admin/week?w=${week}&` : "/admin/week?";
  redirect(
    outcome.sent
      ? `${base}mail_ok=1`
      : `${base}mail_error=${encodeURIComponent(outcome.reason)}`,
  );
}

async function emailReminder(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const week = String(formData.get("w") ?? "");
  if (!id) return;
  mailRedirect(week, await sendSessionReminder(id));
}

async function emailZoom(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const week = String(formData.get("w") ?? "");
  if (!id) return;
  mailRedirect(week, await sendZoomLink(id));
}

async function emailPaymentRequest(formData: FormData) {
  "use server";
  const patientId = String(formData.get("patient_id") ?? "");
  const week = String(formData.get("w") ?? "");
  if (!patientId) return;
  mailRedirect(week, await sendPaymentRequest(patientId));
}

async function markCanceled(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin
    .from("sessions")
    .update({ status: "canceled" })
    .eq("id", id);
  revalidatePath("/admin/week");
}

async function reschedule(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("scheduled_date") ?? "");
  const time = String(formData.get("scheduled_time") ?? "");
  const at = parseLocalInput(`${date}T${time}`);
  if (!id || !at) return;
  await supabaseAdmin
    .from("sessions")
    .update({
      scheduled_at: at.toISOString(),
      // New time — let the crons re-send the reminder and Zoom link.
      reminder_sent_at: null,
      zoom_link_sent_at: null,
    })
    .eq("id", id);
  revalidatePath("/admin/week");
}

async function createSession(formData: FormData) {
  "use server";
  const patientId = String(formData.get("patient_id") ?? "");
  const date = String(formData.get("scheduled_date") ?? "");
  const time = String(formData.get("scheduled_time") ?? "");
  const at = parseLocalInput(`${date}T${time}`);
  if (!patientId || !at) return;
  const duration = Math.round(Number(formData.get("duration_min")));
  const price = Number(formData.get("price"));
  await supabaseAdmin.from("sessions").insert({
    patient_id: patientId,
    scheduled_at: at.toISOString(),
    duration_min: Number.isFinite(duration) && duration > 0 ? duration : 50,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
  });
  revalidatePath("/admin/week");
}

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  // Keep the future filled — cheap and idempotent; never block the view.
  await generatePlannedSessions().catch(() => 0);

  const today = jerusalemYmd(new Date());
  const requested = typeof sp.w === "string" ? parseYmd(sp.w) : null;
  const anchor = requested ?? today;
  const sunday = addDays(anchor, -dayOfWeek(anchor));
  const nextSunday = addDays(sunday, 7);

  const weekStart = zonedToUtc(sunday.y, sunday.m, sunday.d, 0, 0);
  const weekEnd = zonedToUtc(nextSunday.y, nextSunday.m, nextSunday.d, 0, 0);

  const [sessionsRes, patientsRes] = await Promise.all([
    supabaseAdmin
      .from("sessions")
      .select(
        "id, scheduled_at, duration_min, status, price, patient_id, paid_at, reminder_sent_at, zoom_link_sent_at, payment_email_sent_at, patients(name, email)",
      )
      .gte("scheduled_at", weekStart.toISOString())
      .lt("scheduled_at", weekEnd.toISOString())
      .order("scheduled_at"),
    supabaseAdmin.from("patients").select("id, name, rate").order("name"),
  ]);

  const rows = (sessionsRes.data ?? []) as unknown as SessionRow[];
  const patients = (patientsRes.data ?? []) as PatientOption[];

  const byDay: SessionRow[][] = Array.from({ length: 7 }, () => []);
  for (const row of rows) {
    const d = jerusalemYmd(new Date(row.scheduled_at));
    const idx = Math.round(
      (calDate(d).getTime() - calDate(sunday).getTime()) / 86400000,
    );
    if (idx >= 0 && idx < 7) byDay[idx].push(row);
  }

  const saturday = addDays(sunday, 6);
  const feedUrl = process.env.ADMIN_PASSWORD
    ? `https://www.mor-klein.co.il/api/calendar/feed?key=${sessionToken(
        process.env.ADMIN_PASSWORD + ":ics",
      )}`
    : null;

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="font-heading text-2xl font-bold">יומן שבועי</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {rangeFormat.format(calDate(sunday))} – {rangeFormat.format(calDate(saturday))}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href={`/admin/week?w=${ymdString(addDays(sunday, -7))}`}
          className={quietButtonClass}
        >
          → שבוע קודם
        </Link>
        <Link href="/admin/week" className={quietButtonClass}>
          השבוע
        </Link>
        <Link
          href={`/admin/week?w=${ymdString(nextSunday)}`}
          className={quietButtonClass}
        >
          שבוע הבא ←
        </Link>
      </div>

      {sp.mail_ok === "1" ? (
        <p className="mt-4 rounded-lg border border-line bg-sand p-3 text-sm">
          המייל נשלח.
        </p>
      ) : null}
      {typeof sp.mail_error === "string" && sp.mail_error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sp.mail_error}
        </p>
      ) : null}

      {/* New session */}
      <details className="mt-6 rounded-xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-heading font-bold text-accent-deep">
          פגישה חדשה
        </summary>
        <NewSessionForm patients={patients} action={createSession} />
      </details>

      {/* Week, one stacked list per day (mobile-first) */}
      <div className="mt-6 space-y-5">
        {byDay.map((daySessions, i) => {
          const day = addDays(sunday, i);
          const isToday = ymdString(day) === ymdString(today);
          return (
            <section key={i}>
              <h2 className="font-heading font-bold">
                {dayHeadFormat.format(calDate(day))}
                {isToday ? (
                  <span className="mr-2 text-sm font-normal text-accent-deep">
                    · היום
                  </span>
                ) : null}
              </h2>
              {daySessions.length === 0 ? (
                <p className="mt-1 text-sm text-ink-muted">אין פגישות.</p>
              ) : (
                <ul className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                  {daySessions.map((s) => (
                    <li key={s.id} className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-3">
                          <span className="font-semibold tabular-nums" dir="ltr">
                            {timeFormat.format(new Date(s.scheduled_at))}
                          </span>
                          <Link
                            href={`/admin/patients/${s.patient_id}`}
                            className="font-semibold text-accent-deep hover:underline"
                          >
                            {patientName(s)}
                          </Link>
                        </span>
                        {statusBadge(s.status)}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">
                        {s.duration_min} דק׳ · ₪{Number(s.price)}
                      </p>
                      {s.status === "planned" ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <form action={markDone}>
                            <input type="hidden" name="id" value={s.id} />
                            <button type="submit" className={buttonClass}>
                              בוצעה
                            </button>
                          </form>
                          <form action={markCanceled}>
                            <input type="hidden" name="id" value={s.id} />
                            <button type="submit" className={quietButtonClass}>
                              ביטול
                            </button>
                          </form>
                          <details className="w-full">
                            <summary className="cursor-pointer text-sm text-accent-deep hover:underline">
                              שינוי מועד
                            </summary>
                            <form
                              action={reschedule}
                              className="mt-2 flex flex-wrap items-center gap-2"
                            >
                              <input type="hidden" name="id" value={s.id} />
                              <input
                                type="date"
                                name="scheduled_date"
                                dir="ltr"
                                required
                                defaultValue={localInputFormat
                                  .format(new Date(s.scheduled_at))
                                  .split(" ")[0]}
                                className="rounded-lg border border-line bg-surface p-2 text-sm"
                              />
                              <input
                                type="time"
                                name="scheduled_time"
                                dir="ltr"
                                required
                                defaultValue={localInputFormat
                                  .format(new Date(s.scheduled_at))
                                  .split(" ")[1]}
                                className="rounded-lg border border-line bg-surface p-2 text-sm"
                              />
                              <button type="submit" className={buttonClass}>
                                עדכון
                              </button>
                            </form>
                          </details>
                          {patientOf(s)?.email ? (
                            <>
                              <form action={emailReminder}>
                                <input type="hidden" name="id" value={s.id} />
                                <input
                                  type="hidden"
                                  name="w"
                                  value={ymdString(sunday)}
                                />
                                <ConfirmButton
                                  message={`לשלוח תזכורת במייל אל ${patientName(s)}?`}
                                  className={quietButtonClass}
                                >
                                  תזכורת במייל{s.reminder_sent_at ? " ✓" : ""}
                                </ConfirmButton>
                              </form>
                              <form action={emailZoom}>
                                <input type="hidden" name="id" value={s.id} />
                                <input
                                  type="hidden"
                                  name="w"
                                  value={ymdString(sunday)}
                                />
                                <ConfirmButton
                                  message={`לשלוח את קישור הזום במייל אל ${patientName(s)}?`}
                                  className={quietButtonClass}
                                >
                                  קישור זום במייל
                                  {s.zoom_link_sent_at ? " ✓" : ""}
                                </ConfirmButton>
                              </form>
                            </>
                          ) : null}
                        </div>
                      ) : null}
                      {s.status === "done" &&
                      !s.paid_at &&
                      patientOf(s)?.email ? (
                        <form action={emailPaymentRequest} className="mt-3">
                          <input
                            type="hidden"
                            name="patient_id"
                            value={s.patient_id}
                          />
                          <input
                            type="hidden"
                            name="w"
                            value={ymdString(sunday)}
                          />
                          <ConfirmButton
                            message={`לשלוח בקשת תשלום במייל אל ${patientName(s)} על כל היתרה?`}
                            className={quietButtonClass}
                          >
                            בקשת תשלום במייל
                            {s.payment_email_sent_at ? " ✓" : ""}
                          </ConfirmButton>
                        </form>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Google Calendar feed */}
      <section className="mt-10 rounded-xl border border-line bg-surface p-4">
        <h2 className="font-heading text-lg font-bold">חיבור ליומן Google</h2>
        {feedUrl ? (
          <>
            <p className="mt-2 text-sm text-ink-muted">
              ביומן Google: הוספת יומן ← מכתובת URL, ומדביקים את הכתובת הזו.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                dir="ltr"
                value={feedUrl}
                className="w-full min-w-0 rounded-lg border border-line bg-sand p-2 text-xs"
              />
              <CopyButton text={feedUrl} />
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            הכתובת תופיע כאן כשסיסמת הניהול מוגדרת בשרת.
          </p>
        )}
      </section>
    </main>
  );
}
