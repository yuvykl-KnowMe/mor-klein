import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
    </main>
  );
}
