import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

type PhoneCalloutProps = {
  align?: "start" | "center";
};

// A warm, deliberate second path: some people take a while to work up the
// courage, so calling should feel just as welcome as booking. Quieter than the
// primary CTA, but never an afterthought. One-tap dial on mobile.
export function PhoneCallout({ align = "start" }: PhoneCalloutProps) {
  return (
    <div
      className={`flex flex-col gap-2 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <p className="text-ink-muted">מעדיפים פשוט להתקשר? אפשר גם</p>
      <a
        href={`tel:${PHONE_TEL}`}
        dir="ltr"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 py-2 font-medium text-accent-deep transition-colors duration-300 ease-out hover:bg-surface hover:text-accent-deeper"
        aria-label={`להתקשר אל מור בטלפון ${PHONE_DISPLAY}`}
      >
        {/* Line-art phone glyph, in keeping with the Wabi-Sabi motifs */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px]"
        >
          <path
            d="M5.5 4h3l1.5 4-2 1.5a11 11 0 0 0 4.5 4.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z"
            stroke="#5B7B8A"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <span>{PHONE_DISPLAY}</span>
      </a>
    </div>
  );
}
