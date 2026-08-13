import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createReceipt, PAYMENT_METHODS } from "@/lib/morning";
import { supabaseAdmin } from "@/lib/supabase";
import {
  formatDate,
  isHandled,
  statusBadgeClass,
  statusLabel,
  whatsappHref,
  type Submission,
} from "../helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "פרטי פנייה",
  robots: { index: false, follow: false },
};

const actionLinkClass =
  "rounded-lg bg-accent-deep px-4 py-2 text-on-accent hover:bg-accent-deeper";

const inputClass = "mt-1 w-full rounded-lg border border-line bg-surface p-3";

const DEFAULT_DESCRIPTION = "פגישת טיפול";

export default async function SubmissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const { data } = await supabaseAdmin
    .from("intake_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Bad/unknown id (or a query error, e.g. table missing) -> graceful 404.
  if (!data) notFound();

  const s = data as Submission;

  async function updateSubmission(formData: FormData) {
    "use server";
    const update: { status?: string; admin_note?: string } = {};
    const status = formData.get("status");
    if (status === "new" || status === "handled") update.status = status;
    if (formData.has("admin_note")) {
      update.admin_note = String(formData.get("admin_note"));
    }
    await supabaseAdmin.from("intake_submissions").update(update).eq("id", id);
    revalidatePath("/admin");
    revalidatePath(`/admin/${id}`);
  }

  async function issueReceipt(formData: FormData) {
    "use server";
    const amountRaw = String(formData.get("amount") ?? "").trim();
    const methodRaw = String(formData.get("payment_method") ?? "");
    const description =
      String(formData.get("description") ?? "").trim() || DEFAULT_DESCRIPTION;
    const sendEmail = formData.get("send_email") === "on";

    // On failure, round-trip the entered values via the URL so the form keeps them.
    const back = (error: string) =>
      redirect(
        `/admin/${id}?` +
          new URLSearchParams({
            receipt_error: error,
            amount: amountRaw,
            method: methodRaw,
            description,
            ...(sendEmail ? {} : { no_email: "1" }),
          }).toString(),
      );

    const amount = Math.round(Number(amountRaw) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0) {
      return back("יש להזין סכום חוקי (מספר חיובי בשקלים).");
    }
    if (!(methodRaw in PAYMENT_METHODS)) {
      return back("יש לבחור אמצעי תשלום.");
    }

    let receipt;
    try {
      receipt = await createReceipt({
        name: s.full_name,
        phone: s.phone,
        email: sendEmail && s.email ? s.email : undefined,
        amount,
        paymentMethod: methodRaw as keyof typeof PAYMENT_METHODS,
        description,
      });
    } catch (e) {
      const detail = e instanceof Error ? e.message : "שגיאה לא ידועה";
      return back(`הפקת הקבלה נכשלה: ${detail}`);
    }

    await supabaseAdmin
      .from("intake_submissions")
      .update({
        receipt_id: receipt.id,
        receipt_url: receipt.url,
        receipt_amount: amount.toFixed(2),
        receipt_created_at: new Date().toISOString(),
      })
      .eq("id", id);
    revalidatePath(`/admin/${id}`);
    redirect(`/admin/${id}?receipt_ok=1`);
  }

  const fields: [string, string | null][] = [
    ["שם מלא", s.full_name],
    ["נייד", s.phone],
    ["גיל", s.age],
    ["מין", s.gender],
    ['דוא"ל', s.email],
    ["משלח יד", s.occupation],
    ["מצב משפחתי", s.marital_status],
    ["אשפוז פסיכיאטרי", s.hospitalization],
    ["תרופות פסיכיאטריות", s.medication],
    ["מה מביא אותך לטיפול", s.reason],
    ["ציפיות מהטיפול", s.expectations],
  ];

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link href="/admin" className="text-sm text-accent-deep hover:underline">
        &rarr; חזרה לרשימת הפניות
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-bold">{s.full_name}</h1>
        <span className={statusBadgeClass(s.status)}>
          {statusLabel(s.status)}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        התקבלה: {formatDate(s.created_at)}
      </p>

      {/* Quick actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={`tel:${s.phone.replace(/\D/g, "")}`} className={actionLinkClass}>
          התקשרות
        </a>
        <a
          href={whatsappHref(s.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className={actionLinkClass}
        >
          וואטסאפ
        </a>
        {s.email ? (
          <a href={`mailto:${s.email}`} className={actionLinkClass}>
            דוא&quot;ל
          </a>
        ) : null}
      </div>

      {/* All fields */}
      <dl className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
        {fields.map(([label, value]) => (
          <div key={label} className="p-4">
            <dt className="text-sm text-ink-muted">{label}</dt>
            <dd className="mt-1 whitespace-pre-wrap">
              {value?.trim() ? value : "—"}
            </dd>
          </div>
        ))}
      </dl>

      {/* Status toggle */}
      <form action={updateSubmission} className="mt-6">
        <input
          type="hidden"
          name="status"
          value={isHandled(s.status) ? "new" : "handled"}
        />
        <button type="submit" className={actionLinkClass}>
          {isHandled(s.status) ? "סימון כחדש" : "סימון כטופל"}
        </button>
      </form>

      {/* Private note */}
      <form action={updateSubmission} className="mt-6">
        <label htmlFor="admin_note" className="block text-sm text-ink-muted">
          הערה אישית (רק את רואה אותה)
        </label>
        <textarea
          id="admin_note"
          name="admin_note"
          rows={4}
          defaultValue={s.admin_note ?? ""}
          className="mt-2 w-full rounded-lg border border-line bg-surface p-3"
        />
        <button type="submit" className={`${actionLinkClass} mt-3`}>
          שמירת הערה
        </button>
      </form>

      {/* Payment + receipt (Morning / Green Invoice) */}
      <section className="mt-8 rounded-xl border border-line bg-surface p-4">
        <h2 className="font-heading text-lg font-bold">תשלום והפקת קבלה</h2>

        {s.receipt_id ? (
          <p className="mt-2 text-sm text-ink-muted">
            הקבלה האחרונה: ₪{s.receipt_amount}
            {s.receipt_created_at ? ` · ${formatDate(s.receipt_created_at)}` : ""}
            {s.receipt_url ? (
              <>
                {" · "}
                <a
                  href={s.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-deep underline"
                >
                  צפייה בקבלה
                </a>
              </>
            ) : null}
            <br />
            אפשר להפיק קבלה נוספת (למשל עבור פגישה נוספת).
          </p>
        ) : null}

        {sp.receipt_ok === "1" ? (
          <p className="mt-3 rounded-lg border border-line bg-sand p-3 text-sm">
            הקבלה הופקה בהצלחה.
          </p>
        ) : null}
        {typeof sp.receipt_error === "string" && sp.receipt_error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {sp.receipt_error}
          </p>
        ) : null}

        <form action={issueReceipt} className="mt-4 space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm text-ink-muted">
              סכום בש&quot;ח
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="1"
              step="0.01"
              required
              defaultValue={typeof sp.amount === "string" ? sp.amount : ""}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="payment_method"
              className="block text-sm text-ink-muted"
            >
              אמצעי תשלום
            </label>
            <select
              id="payment_method"
              name="payment_method"
              defaultValue={typeof sp.method === "string" ? sp.method : "bit"}
              className={inputClass}
            >
              {Object.entries(PAYMENT_METHODS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm text-ink-muted">
              תיאור
            </label>
            <input
              id="description"
              name="description"
              type="text"
              defaultValue={
                typeof sp.description === "string"
                  ? sp.description
                  : DEFAULT_DESCRIPTION
              }
              className={inputClass}
            />
          </div>
          {s.email ? (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="send_email"
                defaultChecked={sp.no_email !== "1"}
              />
              שליחת הקבלה ללקוח/ה במייל ({s.email})
            </label>
          ) : null}
          <button type="submit" className={actionLinkClass}>
            הפקת קבלה
          </button>
        </form>
      </section>
    </main>
  );
}
