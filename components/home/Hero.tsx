import { PortraitSlot } from "@/components/home/PortraitSlot";
import { CtaLink } from "@/components/ui/CtaLink";
import { BOOKING_URL } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 sm:grid-cols-[1fr_auto] sm:py-24">
        <div className="flex flex-col gap-6">
          <h1
            id="hero-heading"
            className="font-heading text-4xl font-bold leading-[1.2] sm:text-5xl"
          >
            מרחב שקט לעצור בו, ולבחור מחדש
          </h1>
          <p className="max-w-xl text-lg text-ink-muted">
            אני מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W). אני
            מלווה נשים וגברים בשנות העשרים, השלושים והארבעים בצמתים של החיים —
            קריירה, זוגיות והורות צעירה — בשיחות אונליין, בגישה אדלריאנית,
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
