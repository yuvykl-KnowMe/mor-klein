import { supabaseAdmin } from "@/lib/supabase";

// Server-side limits; the client enforces the same via maxLength, but the
// API is the trust boundary.
const SHORT_MAX = 200;
const LONG_MAX = 5000;

class ValidationError extends Error {}

// Returns the trimmed string, or null when absent/empty. Throws on wrong
// type or over-length input.
function field(body: Record<string, unknown>, key: string, max: number) {
  const value = body[key];
  if (value == null || value === "") return null;
  if (typeof value !== "string" || value.length > max) {
    throw new ValidationError(key);
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (typeof body !== "object" || body === null) throw new Error();
  } catch {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  const honeypot = body.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return Response.json({ ok: true });
  }

  let row: {
    full_name: string;
    phone: string;
    age: string | null;
    gender: string | null;
    email: string | null;
    occupation: string | null;
    marital_status: string | null;
    hospitalization: string | null;
    medication: string | null;
    reason: string | null;
    expectations: string | null;
  };
  try {
    const full_name = field(body, "full_name", SHORT_MAX);
    const phone = field(body, "phone", SHORT_MAX);
    if (!full_name || !phone) throw new ValidationError("required");

    // Medication is a choice (לא / בעבר / כיום) plus optional free-text
    // details; both are stored in the single `medication` column.
    const medicationChoice = field(body, "medication", SHORT_MAX);
    const medicationDetails = field(body, "medication_details", SHORT_MAX);
    const medication = medicationChoice
      ? medicationDetails
        ? `${medicationChoice} — ${medicationDetails}`
        : medicationChoice
      : medicationDetails;

    row = {
      full_name,
      phone,
      age: field(body, "age", SHORT_MAX),
      gender: field(body, "gender", SHORT_MAX),
      email: field(body, "email", SHORT_MAX),
      occupation: field(body, "occupation", SHORT_MAX),
      marital_status: field(body, "marital_status", SHORT_MAX),
      hospitalization: field(body, "hospitalization", SHORT_MAX),
      medication,
      reason: field(body, "reason", LONG_MAX),
      expectations: field(body, "expectations", LONG_MAX),
    };
  } catch {
    return Response.json({ error: "invalid fields" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("intake_submissions").insert(row);
  if (error) {
    console.error("intake insert failed:", error.message);
    return Response.json({ error: "server error" }, { status: 500 });
  }

  // Best-effort notification: never fails the request.
  try {
    await notifyMor(row);
  } catch (e) {
    console.error("intake email notification failed:", e);
  }

  return Response.json({ ok: true });
}

async function notifyMor(row: Record<string, string | null>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const labels: Record<string, string> = {
    full_name: "שם מלא",
    phone: "נייד",
    age: "גיל",
    gender: "מין",
    email: 'דוא"ל',
    occupation: "משלח יד",
    marital_status: "מצב משפחתי",
    hospitalization: "אשפוז פסיכיאטרי",
    medication: "תרופות פסיכיאטריות",
    reason: "מה מביא לטיפול",
    expectations: "ציפיות מהטיפול",
  };
  const text = Object.entries(labels)
    .map(([key, label]) => `${label}: ${row[key] ?? "—"}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: ["mor@mor-klein.co.il"],
      subject: `שאלון חדש נשלח מ${row.full_name}`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("intake email notification failed:", res.status, await res.text());
  }
}
