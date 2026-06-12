import {
  EMAIL,
  SITE_NAME,
  TITLE_CREDENTIAL,
  TITLE_PROFESSION,
} from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-ink-muted">
        <p className="font-heading text-base font-bold text-ink">{SITE_NAME}</p>
        <p>
          {TITLE_PROFESSION} · {TITLE_CREDENTIAL}
        </p>
        <p>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex min-h-11 items-center text-accent-deep underline underline-offset-4 hover:text-accent-deeper"
            dir="ltr"
          >
            {EMAIL}
          </a>
        </p>
        {/* TODO: add a link to the accessibility statement page once it ships (required by IS 5568) */}
        <p>© {new Date().getFullYear()} {SITE_NAME}. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
