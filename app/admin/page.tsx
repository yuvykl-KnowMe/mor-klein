import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate, statusBadgeClass, statusLabel } from "./helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ניהול פניות",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  status: string;
};

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("intake_submissions")
    .select("id, full_name, phone, created_at, status")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="font-heading text-2xl font-bold">פניות מהשאלון</h1>

      {error ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-5 text-ink-muted">
          לא הצלחנו לטעון את הפניות כרגע. אפשר לנסות לרענן את הדף בעוד רגע.
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-5 text-ink-muted">
          אין עדיין פניות. ברגע שמישהו ימלא את השאלון — הפנייה תופיע כאן.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/admin/${row.id}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-sand"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {row.full_name}
                  </span>
                  <span className="block text-sm text-ink-muted" dir="ltr">
                    {row.phone}
                  </span>
                  <span className="block text-sm text-ink-muted">
                    {formatDate(row.created_at)}
                  </span>
                </span>
                <span className={statusBadgeClass(row.status)}>
                  {statusLabel(row.status)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
