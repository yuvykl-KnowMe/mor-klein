import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import {
  buttonClass,
  formatILS,
  owedBadgeClass,
  type Patient,
} from "./helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מטופלים",
  robots: { index: false, follow: false },
};

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const owedOnly = sp.owed === "1";

  const [{ data: patientsData, error }, { data: unpaidData }] =
    await Promise.all([
      supabaseAdmin
        .from("patients")
        .select("id, name, phone, rate")
        .order("name"),
      supabaseAdmin
        .from("sessions")
        .select("patient_id, price")
        .eq("status", "done")
        .is("paid_at", null),
    ]);

  const owed = new Map<string, number>();
  for (const row of unpaidData ?? []) {
    owed.set(row.patient_id, (owed.get(row.patient_id) ?? 0) + Number(row.price));
  }

  const patients = ((patientsData ?? []) as Patient[]).filter(
    (p) => !owedOnly || (owed.get(p.id) ?? 0) > 0,
  );

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">מטופלים</h1>
        <Link href="/admin/patients/new" className={buttonClass}>
          מטופל/ת חדש/ה
        </Link>
      </div>

      <div className="mt-4">
        <Link
          href={owedOnly ? "/admin/patients" : "/admin/patients?owed=1"}
          className={
            "inline-block rounded-full border px-3 py-1 text-sm " +
            (owedOnly
              ? "border-red-200 bg-red-50 font-semibold text-red-700"
              : "border-line bg-surface text-ink-muted hover:bg-sand")
          }
        >
          {owedOnly ? "רק חייבים ✓" : "רק חייבים"}
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-5 text-ink-muted">
          לא הצלחנו לטעון את המטופלים כרגע. אפשר לנסות לרענן את הדף בעוד רגע.
        </p>
      ) : patients.length === 0 ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-5 text-ink-muted">
          {owedOnly
            ? "אין כרגע מטופלים עם חוב פתוח."
            : "אין עדיין מטופלים. אפשר להוסיף עם הכפתור למעלה."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {patients.map((p) => {
            const balance = owed.get(p.id) ?? 0;
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/patients/${p.id}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-sand"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">
                      {p.name}
                    </span>
                    {p.phone ? (
                      <span className="block text-sm text-ink-muted" dir="ltr">
                        {p.phone}
                      </span>
                    ) : null}
                    <span className="block text-sm text-ink-muted">
                      תעריף: {formatILS(Number(p.rate))}
                    </span>
                  </span>
                  {balance > 0 ? (
                    <span className={owedBadgeClass}>
                      {formatILS(balance)}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
