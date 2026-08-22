import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createReceipt, PAYMENT_METHODS } from "@/lib/morning";
import { sendPaymentRequest } from "@/lib/notify";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate } from "../../helpers";
import PatientForm from "../PatientForm";
import {
  buttonClass,
  DAY_NAMES,
  formatDateOnly,
  formatILS,
  inputClass,
  owedBadgeClass,
  patientFromForm,
  sessionStatusBadge,
  sessionStatusLabel,
  type Patient,
  type SessionRow,
} from "../helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "תיק מטופל/ת",
  robots: { index: false, follow: false },
};

export default async function PatientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const [{ data: patientData }, { data: sessionsData }] = await Promise.all([
    supabaseAdmin.from("patients").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("patient_id", id)
      .order("scheduled_at", { ascending: false }),
  ]);
  if (!patientData) notFound();

  const p = patientData as Patient;
  const sessions = (sessionsData ?? []) as SessionRow[];

  const unpaid = sessions.filter((s) => s.status === "done" && !s.paid_at);
  const owedTotal =
    Math.round(unpaid.reduce((t, s) => t + Number(s.price), 0) * 100) / 100;
  const paidSessions = sessions.filter((s) => s.status === "done" && s.paid_at);
  const paidTotal = paidSessions.reduce((t, s) => t + Number(s.price), 0);
  const lastReceiptUrl =
    [...paidSessions]
      .filter((s) => s.receipt_url)
      .sort((a, b) => ((a.paid_at ?? "") < (b.paid_at ?? "") ? 1 : -1))[0]
      ?.receipt_url ?? null;

  async function updatePatient(formData: FormData) {
    "use server";
    const parsed = patientFromForm(formData);
    if (!parsed.ok) {
      redirect(
        `/admin/patients/${id}?error=${encodeURIComponent(parsed.error)}`,
      );
    }
    const { error } = await supabaseAdmin
      .from("patients")
      .update(parsed.data)
      .eq("id", id);
    if (error) {
      redirect(
        `/admin/patients/${id}?error=${encodeURIComponent(
          `השמירה נכשלה: ${error.message}`,
        )}`,
      );
    }
    revalidatePath("/admin/patients");
    revalidatePath(`/admin/patients/${id}`);
    redirect(`/admin/patients/${id}?saved=1`);
  }

  // "סיום פגישה" only records the fact — it never emails anyone. Payment
  // requests go out via the explicit button (requestPayment).
  async function finishSession(formData: FormData) {
    "use server";
    const sessionId = String(formData.get("session_id") ?? "");
    // planned-only guard: a double submit cannot mark done twice.
    await supabaseAdmin
      .from("sessions")
      .update({ status: "done", done_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("patient_id", id)
      .eq("status", "planned");
    revalidatePath("/admin/patients");
    revalidatePath(`/admin/patients/${id}`);
  }

  // Records an out-of-band payment (receipt was already issued elsewhere):
  // sets paid_at only, never calls Morning. For backfilled history.
  async function markPaidNoReceipt(formData: FormData) {
    "use server";
    const sessionId = String(formData.get("session_id") ?? "");
    if (!sessionId) return;
    await supabaseAdmin
      .from("sessions")
      .update({ paid_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("patient_id", id)
      .eq("status", "done")
      .is("paid_at", null);
    revalidatePath("/admin/patients");
    revalidatePath(`/admin/patients/${id}`);
  }

  async function requestPayment() {
    "use server";
    const outcome = await sendPaymentRequest(id);
    revalidatePath(`/admin/patients/${id}`);
    redirect(
      outcome.sent
        ? `/admin/patients/${id}?mail_ok=1`
        : `/admin/patients/${id}?mail_error=${encodeURIComponent(outcome.reason)}`,
    );
  }

  async function updateSession(formData: FormData) {
    "use server";
    const sessionId = String(formData.get("session_id") ?? "");
    const price = Math.round(Number(formData.get("price")) * 100) / 100;
    const update: { note: string | null; price?: number } = {
      note: String(formData.get("note") ?? "").trim() || null,
    };
    if (Number.isFinite(price) && price >= 0) update.price = price;
    await supabaseAdmin
      .from("sessions")
      .update(update)
      .eq("id", sessionId)
      .eq("patient_id", id);
    revalidatePath("/admin/patients");
    revalidatePath(`/admin/patients/${id}`);
  }

  async function markPaid(formData: FormData) {
    "use server";
    const back = (error: string) =>
      redirect(
        `/admin/patients/${id}?paid_error=${encodeURIComponent(error)}`,
      );

    if (formData.get("confirm") !== "on") {
      return back("יש לסמן את תיבת האישור לפני הפקת הקבלה.");
    }
    const methodRaw = String(formData.get("payment_method") ?? "");
    if (!(methodRaw in PAYMENT_METHODS)) {
      return back("יש לבחור אמצעי תשלום.");
    }

    // Re-collect at action time — the page may be stale.
    const { data } = await supabaseAdmin
      .from("sessions")
      .select("id, price, scheduled_at")
      .eq("patient_id", id)
      .eq("status", "done")
      .is("paid_at", null)
      .order("scheduled_at", { ascending: true });
    const rows = data ?? [];
    if (rows.length === 0) return back("אין פגישות שממתינות לתשלום.");

    const total =
      Math.round(rows.reduce((t, s) => t + Number(s.price), 0) * 100) / 100;
    if (total <= 0) return back("סכום הפגישות שממתינות לתשלום הוא אפס.");
    if (String(formData.get("expected_total")) !== total.toFixed(2)) {
      return back(
        "רשימת הפגישות השתנתה מאז שהדף נטען — כדאי לבדוק שוב ולאשר מחדש.",
      );
    }

    let receipt;
    try {
      receipt = await createReceipt({
        name: p.name,
        email: p.email ?? undefined,
        phone: p.phone ?? undefined,
        amount: total,
        paymentMethod: methodRaw as keyof typeof PAYMENT_METHODS,
        description: "טיפול פסיכותרפיה",
        remarks: `פגישות בתאריכים: ${rows
          .map((s) => formatDateOnly(s.scheduled_at))
          .join(", ")}`,
      });
    } catch (e) {
      const detail = e instanceof Error ? e.message : "שגיאה לא ידועה";
      return back(`הפקת הקבלה נכשלה: ${detail}`);
    }

    const { error: updateError } = await supabaseAdmin
      .from("sessions")
      .update({
        paid_at: new Date().toISOString(),
        receipt_id: receipt.id,
        receipt_url: receipt.url,
      })
      .in(
        "id",
        rows.map((s) => s.id),
      );
    if (updateError) {
      return back(
        `הקבלה הופקה (מס' ${receipt.number}) אבל סימון הפגישות כשולמו נכשל — לא להפיק קבלה נוספת לפני בדיקה.`,
      );
    }
    revalidatePath("/admin/patients");
    revalidatePath(`/admin/patients/${id}`);
    redirect(`/admin/patients/${id}?receipt_ok=1`);
  }

  const weeklySlot =
    p.weekly_day !== null && p.weekly_time
      ? `יום ${DAY_NAMES[p.weekly_day]} ${p.weekly_time}${p.weekly_active ? "" : " (לא פעיל)"}`
      : null;

  const infoLine = [
    p.rate ? `תעריף: ${formatILS(Number(p.rate))}` : null,
    weeklySlot,
  ].filter(Boolean);

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link
        href="/admin/patients"
        className="text-sm text-accent-deep hover:underline"
      >
        &rarr; חזרה לרשימת המטופלים
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold">{p.name}</h1>
      {infoLine.length > 0 ? (
        <p className="mt-1 text-sm text-ink-muted">{infoLine.join(" · ")}</p>
      ) : null}
      {p.phone || p.email ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {p.phone ? (
            <a
              href={`tel:${p.phone.replace(/\D/g, "")}`}
              className={buttonClass}
            >
              התקשרות
            </a>
          ) : null}
          {p.email ? (
            <a href={`mailto:${p.email}`} className={buttonClass}>
              דוא&quot;ל
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Messages */}
      {sp.saved === "1" ? (
        <p className="mt-4 rounded-lg border border-line bg-sand p-3 text-sm">
          הפרטים נשמרו.
        </p>
      ) : null}
      {typeof sp.error === "string" && sp.error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sp.error}
        </p>
      ) : null}
      {sp.receipt_ok === "1" ? (
        <p className="mt-4 rounded-lg border border-line bg-sand p-3 text-sm">
          הקבלה הופקה וכל הפגישות סומנו כשולמו.
          {lastReceiptUrl ? (
            <>
              {" "}
              <a
                href={lastReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-deep underline"
              >
                צפייה בקבלה
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      {typeof sp.paid_error === "string" && sp.paid_error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sp.paid_error}
        </p>
      ) : null}
      {sp.mail_ok === "1" ? (
        <p className="mt-4 rounded-lg border border-line bg-sand p-3 text-sm">
          בקשת התשלום נשלחה במייל.
        </p>
      ) : null}
      {typeof sp.mail_error === "string" && sp.mail_error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sp.mail_error}
        </p>
      ) : null}

      {/* Balance summary */}
      <section className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-line bg-surface p-3">
          <div
            className={
              "text-lg font-bold" + (owedTotal > 0 ? " text-red-700" : "")
            }
          >
            {formatILS(owedTotal)}
          </div>
          <div className="text-sm text-ink-muted">ממתין לתשלום</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3">
          <div className="text-lg font-bold">{unpaid.length}</div>
          <div className="text-sm text-ink-muted">פגישות לא שולמו</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3">
          <div className="text-lg font-bold">{formatILS(paidTotal)}</div>
          <div className="text-sm text-ink-muted">שולם עד היום</div>
        </div>
      </section>

      {/* Manual payment request */}
      {unpaid.length > 0 && p.email ? (
        <section className="mt-6 rounded-xl border border-line bg-surface p-4">
          <h2 className="font-heading text-lg font-bold">בקשת תשלום</h2>
          <p className="mt-2 text-sm text-ink-muted">
            מייל אל {p.email} עם היתרה ({formatILS(owedTotal)}) וכל אפשרויות
            התשלום. נשלח רק בלחיצה — סימון פגישה כ&quot;בוצעה&quot; לא שולח
            כלום. אם לא שולם תוך 48 שעות מהבקשה, נשלחת תזכורת עדינה אחת
            (אפשר לכבות במרדף תשלום).
          </p>
          <form action={requestPayment} className="mt-3">
            <button type="submit" className={buttonClass}>
              שליחת בקשת תשלום במייל
            </button>
          </form>
        </section>
      ) : null}

      {/* Mark paid + receipt */}
      {unpaid.length > 0 ? (
        <section className="mt-6 rounded-xl border border-line bg-surface p-4">
          <h2 className="font-heading text-lg font-bold">
            סימון שולם והפקת קבלה
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            תופק קבלה אחת על סך {formatILS(owedTotal)} עבור {unpaid.length}{" "}
            פגישות:{" "}
            {[...unpaid]
              .reverse()
              .map((s) => formatDateOnly(s.scheduled_at))
              .join(", ")}
            {p.email ? ` · הקבלה תישלח במייל אל ${p.email}` : ""}
          </p>
          <form action={markPaid} className="mt-4 space-y-4">
            <input
              type="hidden"
              name="expected_total"
              value={owedTotal.toFixed(2)}
            />
            <div>
              <label
                htmlFor="pay_method"
                className="block text-sm text-ink-muted"
              >
                אמצעי תשלום
              </label>
              <select
                id="pay_method"
                name="payment_method"
                defaultValue="bit"
                className={inputClass}
              >
                {Object.entries(PAYMENT_METHODS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="confirm" required />
              אני מאשרת הפקת קבלה אמיתית בהנהלת החשבונות שלי
            </label>
            <button type="submit" className={buttonClass}>
              סימון שולם
            </button>
          </form>
        </section>
      ) : null}

      {/* Sessions history */}
      <section className="mt-8">
        <h2 className="font-heading text-lg font-bold">היסטוריית פגישות</h2>
        {sessions.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line bg-surface p-5 text-ink-muted">
            אין עדיין פגישות. פגישות נקבעות דרך היומן.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {sessions.map((s) => (
              <li key={s.id} className="space-y-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">
                    {formatDate(s.scheduled_at)}
                  </span>
                  <span className={sessionStatusBadge(s.status)}>
                    {sessionStatusLabel(s.status)}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {formatILS(Number(s.price))}
                  </span>
                  {s.status === "done" ? (
                    s.paid_at ? (
                      <span className="text-sm text-ink-muted">
                        שולם
                        {s.receipt_url ? (
                          <>
                            {" · "}
                            <a
                              href={s.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-deep underline"
                            >
                              קבלה
                            </a>
                          </>
                        ) : null}
                      </span>
                    ) : (
                      <span className={owedBadgeClass}>לא שולם</span>
                    )
                  ) : null}
                </div>

                {s.note ? (
                  <p className="whitespace-pre-wrap text-sm text-ink-muted">
                    {s.note}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  {s.status === "planned" ? (
                    <form action={finishSession}>
                      <input type="hidden" name="session_id" value={s.id} />
                      <button type="submit" className={buttonClass}>
                        סיום פגישה
                      </button>
                    </form>
                  ) : null}
                  {s.status === "done" && !s.paid_at ? (
                    <form action={markPaidNoReceipt}>
                      <input type="hidden" name="session_id" value={s.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm hover:bg-sand"
                      >
                        שולם בעבר (בלי קבלה)
                      </button>
                    </form>
                  ) : null}
                  <details className="w-full">
                    <summary className="cursor-pointer text-sm text-accent-deep hover:underline">
                      עריכה
                    </summary>
                    <form action={updateSession} className="mt-2 space-y-3">
                      <input type="hidden" name="session_id" value={s.id} />
                      <div>
                        <label
                          htmlFor={`price-${s.id}`}
                          className="block text-sm text-ink-muted"
                        >
                          מחיר (₪)
                        </label>
                        <input
                          id={`price-${s.id}`}
                          name="price"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          defaultValue={Number(s.price)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`note-${s.id}`}
                          className="block text-sm text-ink-muted"
                        >
                          הערה לפגישה
                        </label>
                        <textarea
                          id={`note-${s.id}`}
                          name="note"
                          rows={2}
                          defaultValue={s.note ?? ""}
                          className={inputClass}
                        />
                      </div>
                      <button type="submit" className={buttonClass}>
                        שמירה
                      </button>
                    </form>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Patient details edit */}
      <details className="mt-8 rounded-xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-heading text-lg font-bold">
          עריכת פרטי מטופל/ת
        </summary>
        <PatientForm
          action={updatePatient}
          defaults={p}
          submitLabel="שמירת שינויים"
        />
      </details>
    </main>
  );
}
