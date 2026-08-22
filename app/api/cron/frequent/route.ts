import { sendZoomLink } from "@/lib/notify";
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
    .select("id, patients(email, zoom_enabled)")
    .eq("status", "planned")
    .is("zoom_link_sent_at", null)
    .gt("scheduled_at", now.toISOString())
    .lte("scheduled_at", in12min.toISOString());
  if (error) console.error("frequent zoom query failed:", error.message);

  for (const s of starting ?? []) {
    const p = Array.isArray(s.patients) ? s.patients[0] : s.patients;
    if (!p?.email || !p.zoom_enabled) continue;
    const result = await sendZoomLink(s.id);
    if (result.sent) sent++;
    else skipped++;
  }

  return Response.json({ sent, skipped });
}

export { GET as POST };
