import type { ReactNode } from "react";

// Shared shell for the text-heavy legal pages (/privacy, /terms), so they stay
// visually consistent with the home page sections (max-w-3xl prose, same tokens).

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="flex-1">
      <section aria-labelledby="legal-heading">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
          <h1
            id="legal-heading"
            className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
          >
            {title}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">עודכן לאחרונה: {updated}</p>
          <div className="mt-12 flex flex-col gap-10">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-lg text-ink-muted">
        {children}
      </div>
    </section>
  );
}
