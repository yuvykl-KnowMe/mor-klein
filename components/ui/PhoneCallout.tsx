import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";

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
      <div className="flex flex-wrap gap-2">
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
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 py-2 font-medium text-accent-deep transition-colors duration-300 ease-out hover:bg-surface hover:text-accent-deeper"
          aria-label="לשלוח הודעה למור בוואטסאפ"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
          >
            <path
              d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z"
              stroke="#5B7B8A"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 8.5c-.3 2 1.8 5.2 5.5 6 .8-.1 1.5-.7 1.5-1.4l-1.8-.9-.9.8c-.9-.4-1.8-1.3-2.2-2.200l.7-.9-.9-1.800c-.6 0-1.800.4-1.900.4Z"
              fill="#5B7B8A"
            />
          </svg>
          <span>וואטסאפ</span>
        </a>
      </div>
    </div>
  );
}
