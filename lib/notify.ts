// Email senders shared by the admin UI (manual buttons) and the cron sweeps.
// Policy lives in the caller: cron pre-filters by the per-patient toggles
// (reminders_enabled / zoom_enabled / chase_enabled) and by *_sent_at stamps;
// the manual admin buttons send unconditionally. Senders only check that a
// send is possible (email address, balance, config), and stamp *_sent_at on
// success. Dormant without RESEND_API_KEY (see lib/email.ts).

import { emailHtml, paymentParagraphs, sendEmail, type SendResult } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";

export type SendOutcome = { sent: true } | { sent: false; reason: string };

const whenFormat = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

function failure(result: Exclude<SendResult, { ok: true }>): SendOutcome {
  return {
    sent: false,
    reason:
      "skipped" in result
        ? "שליחת מיילים לא מוגדרת בשרת (חסר RESEND_API_KEY)"
        : `השליחה נכשלה: ${result.error}`,
  };
}

type PatientRef = {
  name: string;
  email: string | null;
  zoom_enabled?: boolean;
} | null;

function patientOf(p: PatientRef | PatientRef[]): PatientRef {
  return Array.isArray(p) ? (p[0] ?? null) : p;
}

/** Total unpaid balance: sum of price over done, unpaid sessions. */
export async function unpaidTotalFor(patientId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("price")
    .eq("patient_id", patientId)
    .eq("status", "done")
    .is("paid_at", null);
  if (error) throw new Error(error.message);
  return (data ?? []).reduce((sum, r) => sum + (Number(r.price) || 0), 0);
}

/**
 * Payment request for the patient's whole unpaid balance, listing every way
 * to pay. Used by the manual "שליחת בקשת תשלום" button; the 48h chase sends
 * its own softer wording but shares paymentParagraphs. Stamps
 * payment_email_sent_at on all covered sessions.
 */
export async function sendPaymentRequest(
  patientId: string,
): Promise<SendOutcome> {
  const { data: p } = await supabaseAdmin
    .from("patients")
    .select("name, email")
    .eq("id", patientId)
    .maybeSingle();
  if (!p) return { sent: false, reason: "המטופל/ת לא נמצאו" };
  if (!p.email) return { sent: false, reason: "למטופל/ת אין כתובת מייל" };

  let total: number;
  try {
    total = await unpaidTotalFor(patientId);
  } catch (e) {
    return {
      sent: false,
      reason: `שגיאה בחישוב היתרה: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
  if (total <= 0) return { sent: false, reason: "אין יתרה לתשלום" };

  const result = await sendEmail({
    to: p.email,
    subject: "תשלום על הפגישות שלנו",
    html: emailHtml([`שלום ${p.name},`, ...paymentParagraphs(total), "תודה!"]),
  });
  if (!("ok" in result)) return failure(result);

  await supabaseAdmin
    .from("sessions")
    .update({ payment_email_sent_at: new Date().toISOString() })
    .eq("patient_id", patientId)
    .eq("status", "done")
    .is("paid_at", null);
  return { sent: true };
}

/**
 * Session reminder (26h cron + manual button): date and time, a self-service
 * cancel link, and the Zoom link when the patient's zoom_enabled is on.
 * Stamps reminder_sent_at.
 */
export async function sendSessionReminder(
  sessionId: string,
): Promise<SendOutcome> {
  const { data: s } = await supabaseAdmin
    .from("sessions")
    .select(
      "id, scheduled_at, cancel_token, patients(name, email, zoom_enabled)",
    )
    .eq("id", sessionId)
    .maybeSingle();
  if (!s) return { sent: false, reason: "הפגישה לא נמצאה" };
  const p = patientOf(s.patients as PatientRef | PatientRef[]);
  if (!p?.email) return { sent: false, reason: "למטופל/ת אין כתובת מייל" };

  const when = whenFormat.format(new Date(s.scheduled_at));
  const zoomUrl = process.env.MOR_ZOOM_URL;
  const result = await sendEmail({
    to: p.email,
    subject: "תזכורת לפגישה שלנו",
    html: emailHtml([
      `שלום ${p.name},`,
      `רק תזכורת קטנה — הפגישה שלנו מתקיימת ב${when}.`,
      ...(p.zoom_enabled && zoomUrl
        ? [`הקישור לפגישה בזום: <a href="${zoomUrl}">${zoomUrl}</a>`]
        : []),
      `אם משהו השתנה אפשר לבטל <a href="https://www.mor-klein.co.il/cancel/${s.cancel_token}">כאן</a>.`,
      "נתראה!",
    ]),
  });
  if (!("ok" in result)) return failure(result);

  await supabaseAdmin
    .from("sessions")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("id", sessionId);
  return { sent: true };
}

/**
 * Zoom-link email shortly before the session (frequent cron + manual button).
 * Stamps zoom_link_sent_at.
 */
export async function sendZoomLink(sessionId: string): Promise<SendOutcome> {
  const zoomUrl = process.env.MOR_ZOOM_URL;
  if (!zoomUrl) {
    return { sent: false, reason: "MOR_ZOOM_URL לא מוגדר בשרת" };
  }
  const { data: s } = await supabaseAdmin
    .from("sessions")
    .select("id, patients(name, email)")
    .eq("id", sessionId)
    .maybeSingle();
  if (!s) return { sent: false, reason: "הפגישה לא נמצאה" };
  const p = patientOf(s.patients as PatientRef | PatientRef[]);
  if (!p?.email) return { sent: false, reason: "למטופל/ת אין כתובת מייל" };

  const result = await sendEmail({
    to: p.email,
    subject: "הקישור לפגישה שלנו",
    html: emailHtml([
      `שלום ${p.name},`,
      `הקישור לפגישה שלנו: <a href="${zoomUrl}">${zoomUrl}</a>`,
      "נתראה עוד מעט!",
    ]),
  });
  if (!("ok" in result)) return failure(result);

  await supabaseAdmin
    .from("sessions")
    .update({ zoom_link_sent_at: new Date().toISOString() })
    .eq("id", sessionId);
  return { sent: true };
}
