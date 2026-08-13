import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { emailHtml, sendEmail } from "@/lib/email";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase";

// Public cancellation page. No auth — the cancel_token (a UUID only the
// patient received by email) is the secret. Never indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ביטול פגישה",
  robots: { index: false, follow: false },
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const whenFormat = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

type CancelRow = {
  id: string;
  scheduled_at: string;
  status: string;
  patients: { name: string } | { name: string }[] | null;
};

async function findByToken(token: string): Promise<CancelRow | null> {
  if (!UUID_RE.test(token)) return null;
  const { data } = await supabaseAdmin
    .from("sessions")
    .select("id, scheduled_at, status, patients(name)")
    .eq("cancel_token", token)
    .maybeSingle();
  return data;
}

function patientName(row: CancelRow): string {
  const p = Array.isArray(row.patients) ? row.patients[0] : row.patients;
  return p?.name ?? "";
}

async function cancelByToken(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  const session = await findByToken(token);
  if (
    session &&
    session.status === "planned" &&
    new Date(session.scheduled_at) > new Date()
  ) {
    const { error } = await supabaseAdmin
      .from("sessions")
      .update({ status: "canceled" })
      .eq("id", session.id)
      .eq("status", "planned");
    if (!error) {
      // Best-effort heads-up to Mor; never blocks the patient's flow.
      try {
        await sendEmail({
          to: EMAIL,
          subject: `פגישה בוטלה — ${patientName(session)}`,
          html: emailHtml([
            `${patientName(session)} ביטל/ה את הפגישה שנקבעה ל${whenFormat.format(new Date(session.scheduled_at))}.`,
            "הביטול נעשה דרך קישור הביטול שבמייל התזכורת.",
          ]),
        });
      } catch (e) {
        console.error("cancel notification to Mor failed:", e);
      }
    }
  }
  redirect(`/cancel/${token}?done=1`);
}

export default async function CancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await params;
  const { done } = await searchParams;
  const session = await findByToken(token);

  const justCanceled =
    done === "1" && session != null && session.status === "canceled";
  const cancelable =
    session != null &&
    session.status === "planned" &&
    new Date(session.scheduled_at) > new Date();

  return (
    <main id="main" className="flex-1">
      <section aria-labelledby="cancel-heading">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
          {justCanceled ? (
            <>
              <h1
                id="cancel-heading"
                className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
              >
                הפגישה בוטלה
              </h1>
              <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
                <p>תודה שעדכנת — הפגישה בוטלה בהצלחה.</p>
                <p>
                  אשמח שנתאם מועד חדש. אפשר להתקשר או לשלוח הודעה למספר{" "}
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="font-medium text-accent-deep hover:text-accent-deeper"
                    dir="ltr"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  .
                </p>
                <p>מור</p>
              </div>
            </>
          ) : cancelable ? (
            <>
              <h1
                id="cancel-heading"
                className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
              >
                ביטול פגישה
              </h1>
              <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
                <p>שלום {patientName(session)},</p>
                <p>
                  הפגישה שלנו קבועה ל
                  <strong className="text-ink">
                    {whenFormat.format(new Date(session.scheduled_at))}
                  </strong>
                  .
                </p>
                <p>אם משהו השתנה ואי אפשר להגיע — אפשר לבטל כאן:</p>
              </div>
              <form action={cancelByToken} className="mt-8">
                <input type="hidden" name="token" value={token} />
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent-deep px-6 py-2 font-medium text-on-accent transition-colors duration-300 ease-out hover:bg-accent-deeper"
                >
                  ביטול הפגישה
                </button>
              </form>
            </>
          ) : (
            <>
              <h1
                id="cancel-heading"
                className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
              >
                הקישור כבר לא בתוקף
              </h1>
              <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
                <p>
                  יכול להיות שהפגישה כבר בוטלה, התקיימה, או שהקישור לא תקין.
                </p>
                <p>
                  אם צריך לשנות משהו — אפשר פשוט להתקשר או לשלוח הודעה למספר{" "}
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="font-medium text-accent-deep hover:text-accent-deeper"
                    dir="ltr"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  .
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
