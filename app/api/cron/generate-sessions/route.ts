import { generatePlannedSessions } from "@/lib/sessions";

// Recurring-session generator. Idempotent — safe to call any number of times.
// No auth for now (harmless + idempotent); if that ever changes, add a
// CRON_SECRET check here (e.g. require Authorization: Bearer $CRON_SECRET).
export async function GET() {
  const created = await generatePlannedSessions();
  return Response.json({ created });
}

export { GET as POST };
