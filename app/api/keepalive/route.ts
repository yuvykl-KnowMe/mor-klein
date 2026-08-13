import { supabaseAdmin } from "@/lib/supabase";

// Pinged daily by Vercel Cron (see vercel.json) so the free-tier Supabase
// project never pauses for inactivity again (it auto-pauses after ~7 idle days).
export async function GET() {
  const { error } = await supabaseAdmin
    .from("intake_submissions")
    .select("id")
    .limit(1);
  return Response.json({ ok: !error });
}
