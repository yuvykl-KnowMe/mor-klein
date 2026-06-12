import { CtaLink } from "@/components/ui/CtaLink";
import { EMAIL } from "@/lib/site";

export function ClosingCta() {
  return (
    <section aria-labelledby="contact-heading" id="contact" className="scroll-mt-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28 lg:py-32">
        <h2
          id="contact-heading"
          className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl"
        >
          נתחיל בשיחה
        </h2>
        <p className="max-w-xl text-lg text-ink-muted">
          שיחת ההיכרות הראשונה היא ללא עלות וללא התחייבות, הזדמנות להכיר,
          לשאול, ולבדוק יחד אם זה מתאים לכם.
        </p>
        {/* TODO: point at the Cal.com booking URL once scheduling is wired up */}
        <CtaLink href={`mailto:${EMAIL}`}>כתבו לי לתיאום שיחת היכרות</CtaLink>
        <p className="text-ink-muted">
          או במייל:{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex min-h-11 items-center text-sage-deep underline underline-offset-4 hover:text-sage-deeper"
            dir="ltr"
          >
            {EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
