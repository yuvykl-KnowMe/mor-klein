import { emailHtml, sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";

// Every-few-minutes sweep: Zoom link shortly before the session starts.
// Idempotent via zoom_link_sent_at, so no auth needed — repeated calls are
// no-ops. If that ever changes, add a CRON_SECRET check (require
// Authorization: Bearer $CRON_SECRET).

export async function GET() {
  let sent = 0;
  let skipped = 0;
  const now = new Date();
  const in12min = new Date(now.getTime() + 12 * 60 * 1000);

  const { data: starting, error } = await supabaseAdmin
    .from("sessions")
    .select("id, patients(name, email, reminders_enabled)")
    .eq("status", "planned")
    .is("zoom_link_sent_at", null)
    .gt("scheduled_at", now.toISOString())
    .lte("scheduled_at", in12min.toISOString());
  if (error) console.error("frequent zoom query failed:", error.message);

  const zoomUrl = process.env.MOR_ZOOM_URL;

  for (const s of starting ?? []) {
    const p = Array.isArray(s.patients) ? s.patients[0] : s.patients;
    if (!p?.email || !p.reminders_enabled) continue;
    if (!zoomUrl) {
      console.log("[frequent] MOR_ZOOM_URL missing, skipping zoom link email");
      skipped++;
      continue;
    }
    const result = await sendEmail({
      to: p.email,
      subject: "הקישור לפגישה שלנו",
      html: emailHtml([
        `שלום ${p.name},`,
        `הקישור לפגישה שלנו: <a href="${zoomUrl}">${zoomUrl}</a>`,
        "נתראה עוד מעט!",
      ]),
    });
    if ("ok" in result) {
      await supabaseAdmin
        .from("sessions")
        .update({ zoom_link_sent_at: new Date().toISOString() })
        .eq("id", s.id);
      sent++;
    } else {
      skipped++;
    }
  }

  return Response.json({ sent, skipped });
}

export { GET as POST };
