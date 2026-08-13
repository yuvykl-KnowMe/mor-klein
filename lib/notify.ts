// Notification hooks. Callers (admin actions) invoke these and must never
// fail if sending fails. Dormant without RESEND_API_KEY (see lib/email.ts):
// sends are skipped and *_sent_at columns stay null.

import { emailHtml, paymentParagraphs, sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";

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

/** Called right after a session is marked done. Sends the payment-due email
 *  (total unpaid balance) to the patient. Never throws. */
export async function onSessionDone(sessionId: string): Promise<void> {
  try {
    const { data: session, error } = await supabaseAdmin
      .from("sessions")
      .select("id, patient_id, patients(name, email)")
      .eq("id", sessionId)
      .single();
    if (error || !session) return;

    const p = Array.isArray(session.patients)
      ? session.patients[0]
      : session.patients;
    if (!p?.email) return;

    const total = await unpaidTotalFor(session.patient_id);
    if (total <= 0) return; // nothing due (e.g. zero-priced session)

    const result = await sendEmail({
      to: p.email,
      subject: "תשלום על הפגישות שלנו",
      html: emailHtml([
        `שלום ${p.name},`,
        "תודה על הפגישה היום.",
        ...paymentParagraphs(total),
      ]),
    });

    if ("ok" in result) {
      await supabaseAdmin
        .from("sessions")
        .update({ payment_email_sent_at: new Date().toISOString() })
        .eq("id", sessionId);
    }
  } catch (e) {
    // The admin action must never break because of a notification.
    console.error("onSessionDone failed:", e);
  }
}
