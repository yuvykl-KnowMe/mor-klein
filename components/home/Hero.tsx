import { PortraitSlot } from "@/components/home/PortraitSlot";
import { CtaLink } from "@/components/ui/CtaLink";
import { BOOKING_URL } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-20 sm:grid-cols-[1fr_auto] sm:gap-16 sm:py-28 lg:py-32">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <h1
              id="hero-heading"
              className="font-heading text-5xl font-extrabold leading-[1.08] sm:text-6xl lg:text-7xl"
            >
              מרחב שקט לעצור בו, ולבחור מחדש
            </h1>
            {/* Hand-drawn underline flourish: decorative, sage, low opacity */}
            <svg
              aria-hidden="true"
              viewBox="0 0 300 22"
              fill="none"
              className="h-[18px] w-52 opacity-50 sm:w-64"
              preserveAspectRatio="none"
            >
              <path
                d="M4 13c44-7 92 6 138 1 40-4 86-9 154 3"
                stroke="#7C8C6E"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="max-w-xl text-lg text-ink-muted">
            אני מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W). אני
            מלווה נשים וגברים בשנות העשרים, השלושים והארבעים בצמתים של החיים:
            קריירה, זוגיות והורות צעירה, בשיחות אונליין, בגישה אדלריאנית,
            בקצב שלכם.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <CtaLink href={BOOKING_URL}>לתיאום שיחת היכרות ללא עלות</CtaLink>
            <CtaLink href="#approach" variant="ghost">
              איך אני עובדת
            </CtaLink>
          </div>
        </div>
        <PortraitSlot />
      </div>
    </section>
  );
}
