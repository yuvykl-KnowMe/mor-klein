import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import PatientForm from "../PatientForm";
import { patientFromForm } from "../helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מטופל/ת חדש/ה",
  robots: { index: false, follow: false },
};

export default async function NewPatientPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const str = (key: string) => (typeof sp[key] === "string" ? sp[key] : "");

  async function createPatient(formData: FormData) {
    "use server";
    const parsed = patientFromForm(formData);
    if (!parsed.ok) {
      redirect(`/admin/patients/new?error=${encodeURIComponent(parsed.error)}`);
    }
    const { data, error } = await supabaseAdmin
      .from("patients")
      .insert(parsed.data)
      .select("id")
      .single();
    if (error || !data) {
      redirect(
        `/admin/patients/new?error=${encodeURIComponent("השמירה נכשלה, אפשר לנסות שוב.")}`,
      );
    }
    revalidatePath("/admin/patients");
    redirect(`/admin/patients/${data.id}`);
  }

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link
        href="/admin/patients"
        className="text-sm text-accent-deep hover:underline"
      >
        &rarr; חזרה לרשימת המטופלים
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-bold">מטופל/ת חדש/ה</h1>

      {typeof sp.error === "string" && sp.error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sp.error}
        </p>
      ) : null}

      {/* ?name=&phone=&email= prefill, so intake pages can link here later. */}
      <PatientForm
        action={createPatient}
        defaults={{ name: str("name"), phone: str("phone"), email: str("email") }}
        submitLabel="יצירת מטופל/ת"
      />
    </main>
  );
}
