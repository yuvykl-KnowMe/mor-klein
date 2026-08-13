import { safeEqual, sessionToken } from "@/lib/adminSession";
import { supabaseAdmin } from "@/lib/supabase";

// iCalendar feed of all non-canceled sessions (1 month back .. 3 months
// ahead) for Google Calendar's "from URL" subscription. Auth: ?key= must
// equal an HMAC derived from ADMIN_PASSWORD; fails closed.

/** RFC 5545 date-time in UTC: 20260813T143000Z */
function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escape TEXT values per RFC 5545. */
function icsEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold lines longer than 75 octets (CRLF + space), never mid-UTF-8-char. */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const chunks: string[] = [];
  let start = 0;
  let limit = 75; // continuation lines lose one octet to the leading space
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) {
      end--; // back up off a UTF-8 continuation byte
    }
    chunks.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74;
  }
  return chunks.join("\r\n ");
}

type Row = {
  id: string;
  scheduled_at: string;
  duration_min: number;
  patients: { name: string } | { name: string }[] | null;
};

export async function GET(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!password || !safeEqual(key, sessionToken(password + ":ics"))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const from = new Date();
  from.setUTCMonth(from.getUTCMonth() - 1);
  const to = new Date();
  to.setUTCMonth(to.getUTCMonth() + 3);

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("id, scheduled_at, duration_min, patients(name)")
    .neq("status", "canceled")
    .gte("scheduled_at", from.toISOString())
    .lt("scheduled_at", to.toISOString())
    .order("scheduled_at");
  if (error) return new Response("Server error", { status: 500 });

  const stamp = icsDate(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//mor-klein.co.il//sessions//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    fold("X-WR-CALNAME:פגישות — מור קליין"),
  ];
  for (const row of (data ?? []) as unknown as Row[]) {
    const p = Array.isArray(row.patients) ? row.patients[0] : row.patients;
    const start = new Date(row.scheduled_at);
    const end = new Date(start.getTime() + (row.duration_min || 50) * 60000);
    lines.push(
      "BEGIN:VEVENT",
      fold(`UID:${row.id}`),
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      fold(`SUMMARY:${icsEscape(`פגישה: ${p?.name ?? "מטופל/ת"}`)}`),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
