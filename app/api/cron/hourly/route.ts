import { emailHtml, paymentParagraphs, sendEmail } from "@/lib/email";
import { sendSessionReminder, unpaidTotalFor } from "@/lib/notify";
import { supabaseAdmin } from "@/lib/supabase";

// Hourly sweeps: 26h session reminders + payment chase. The chase fires only
// for sessions whose payment REQUEST went out (payment_email_sent_at) 48h+
// ago and is still unpaid — marking a session done never emails anyone.
// Idempotent via reminder_sent_at / chase_sent_at, so no auth needed —
// repeated calls are no-ops. If that ever changes, add a CRON_SECRET check
// (require Authorization: Bearer $CRON_SECRET).

type PatientRef =
  | { name: string; email: string | null; reminders_enabled?: boolean; chase_enabled?: boolean }
  | null;

function patientOf(p: PatientRef | PatientRef[]): PatientRef {
  return Array.isArray(p) ? (p[0] ?? null) : p;
}

export async function GET() {
  let sent = 0;
  let skipped = 0;
  const now = new Date();

  // (a) 26-hour reminders for upcoming planned sessions.
  const in26h = new Date(now.getTime() + 26 * 60 * 60 * 1000);
  const { data: upcoming, error: upErr } = await supabaseAdmin
    .from("sessions")
    .select("id, patients(name, email, reminders_enabled)")
    .eq("status", "planned")
    .is("reminder_sent_at", null)
    .gt("scheduled_at", now.toISOString())
    .lte("scheduled_at", in26h.toISOString());
  if (upErr) console.error("hourly reminders query failed:", upErr.message);

  for (const s of upcoming ?? []) {
    const p = patientOf(s.patients);
    if (!p?.email || !p.reminders_enabled) continue;
    const result = await sendSessionReminder(s.id);
    if (result.sent) sent++;
    else skipped++;
  }

  // (b) One-time chase, 48h after a payment request that is still unpaid.
  const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const { data: unpaid, error: unpErr } = await supabaseAdmin
    .from("sessions")
    .select("id, patient_id, patients(name, email, chase_enabled)")
    .eq("status", "done")
    .is("paid_at", null)
    .is("chase_sent_at", null)
    .not("payment_email_sent_at", "is", null)
    .lt("payment_email_sent_at", cutoff48h.toISOString());
  if (unpErr) console.error("hourly chase query failed:", unpErr.message);

  for (const s of unpaid ?? []) {
    const p = patientOf(s.patients);
    if (!p?.email || !p.chase_enabled) continue;
    const total = await unpaidTotalFor(s.patient_id);
    if (total <= 0) continue;
    const result = await sendEmail({
      to: p.email,
      subject: "תזכורת עדינה לתשלום",
      html: emailHtml([
        `שלום ${p.name},`,
        "רק תזכורת עדינה לגבי התשלום על הפגישות שלנו.",
        ...paymentParagraphs(total),
        "תודה!",
      ]),
    });
    if ("ok" in result) {
      await supabaseAdmin
        .from("sessions")
        .update({ chase_sent_at: new Date().toISOString() })
        .eq("id", s.id);
      sent++;
    } else {
      skipped++;
    }
  }

  return Response.json({ sent, skipped });
}

export { GET as POST };
