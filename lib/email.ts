import { PHONE_DISPLAY } from "@/lib/site";

// Thin Resend REST wrapper (no SDK dependency). SAFELY DORMANT: without
// RESEND_API_KEY every send is a logged no-op returning {skipped: true},
// so callers know NOT to mark *_sent_at columns.

export type SendResult =
  | { ok: true }
  | { skipped: true }
  | { error: string };

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email] skipped (no RESEND_API_KEY): "${subject}" -> ${to}`);
    return { skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "מור קליין <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const detail = `${res.status} ${await res.text()}`;
      console.error(`[email] send failed: ${detail}`);
      return { error: detail };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { error: String(e) };
  }
}

/** Warm, short Hebrew RTL email body: paragraphs + Mor's signature. */
export function emailHtml(paragraphs: string[]): string {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 14px;">${p}</p>`)
    .join("");
  return `<div dir="rtl" lang="he" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#333333;max-width:560px;margin:0 auto;padding:16px;text-align:right;">
${body}
<p style="margin:24px 0 0;">מור קליין — פסיכותרפיסטית</p>
</div>`;
}

/** Shared payment-request paragraphs (payment-due email + 48h chase). */
export function paymentParagraphs(total: number): string[] {
  return [
    `היתרה לתשלום כרגע היא <strong>${total} ₪</strong>.`,
    `אפשר לשלם בביט או בפייבוקס למספר ${PHONE_DISPLAY}.`,
    "אם נוח לך אחרת — אפשר לתאם איתי.",
  ];
}
