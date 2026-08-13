import type { Metadata } from "next";
import { Blob, Float } from "@/components/decor/Decor";
import { IntakeForm } from "@/components/intake/IntakeForm";

// Private page reached only via a link Mor sends personally (WhatsApp).
// Never indexed and never linked from the site navigation.
export const metadata: Metadata = {
  title: "שאלון פרטים אישיים",
  robots: { index: false, follow: false },
};

export default function Intake() {
  return (
    <main id="main" className="relative isolate flex-1 overflow-hidden">
      {/* Two quiet gold blobs, matching the site's decoration, kept minimal. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Float className="-end-16 top-[6%] h-64 w-64" speed={0.14} reveal={false}>
          <Blob />
        </Float>
        <Float className="-start-20 top-[55%] h-72 w-72" speed={-0.16} reveal={false}>
          <Blob />
        </Float>
      </div>

      <section aria-labelledby="intake-heading">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
          <h1
            id="intake-heading"
            className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
          >
            שאלון פרטים אישיים
          </h1>

          {/* Mor's intro text, verbatim. */}
          <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
            <p>שלום רב,</p>
            <p>
              שמי מור קליין ואני פסיכותרפיסטית אדלריאנית ועובדת סוציאלית
              קלינית, מלווה מבוגרים בתהליכי שינוי, זוגיות, קריירה, הורות
              והתפתחות אישית.
            </p>
            <p>
              בכדי שנוכל להתחיל את המפגשים הטיפוליים אשמח אם תוכל/י להקדיש כמה
              רגעים כדי למלא את השאלון. מילוי השאלון יסייע לי להכיר מעט ולך
              לדייק את עצמך.
            </p>
            <p>
              חשוב לציין, שחלה סודיות מלאה על פרטייך, והמקרים מובאים להדרכה
              מקצועית בעילום שם ופרטים מזהים.
            </p>
          </div>

          <div className="mt-10">
            <IntakeForm />
          </div>
        </div>
      </section>
    </main>
  );
}
