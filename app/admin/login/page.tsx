import type { Metadata } from "next";
import { login } from "./actions";
import { PasswordInput } from "./PasswordInput";

export const metadata: Metadata = {
  title: "כניסה לאזור הניהול",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main id="main" className="mx-auto w-full max-w-sm flex-1 px-4 py-16">
      <h1 className="font-heading text-2xl font-bold">כניסה לאזור הניהול</h1>
      <p className="mt-2 text-sm text-ink-muted">
        האזור הזה מיועד למור בלבד.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          שם המשתמש או הסיסמה אינם נכונים. אפשר לנסות שוב.
        </p>
      ) : null}

      <form action={login} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>שם משתמש</span>
          <input
            type="text"
            name="username"
            defaultValue="mor"
            required
            autoComplete="username"
            dir="ltr"
            className="min-h-11 rounded-xl border border-line bg-surface px-3 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>סיסמה</span>
          <PasswordInput />
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-full bg-accent-deep px-6 font-heading font-bold text-on-accent transition-colors duration-300 ease-out hover:bg-accent-deeper"
        >
          כניסה
        </button>
      </form>
    </main>
  );
}
