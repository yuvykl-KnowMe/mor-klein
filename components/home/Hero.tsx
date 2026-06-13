import { PortraitSlot } from "@/components/home/PortraitSlot";
import { BookingButton } from "@/components/ui/BookingButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { PhoneCallout } from "@/components/ui/PhoneCallout";

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
              להאט, גם כשהכול דורש ממך להאיץ
            </h1>
            {/* Hand-drawn underline flourish: decorative, slate accent, low opacity */}
            <svg
              aria-hidden="true"
              viewBox="0 0 300 22"
              fill="none"
              className="h-[18px] w-52 opacity-50 sm:w-64"
              preserveAspectRatio="none"
            >
              <path
                d="M4 13c44-7 92 6 138 1 40-4 86-9 154 3"
                stroke="#5B7B8A"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="max-w-xl text-lg text-ink-muted">
            אני מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W). אני
            מלווה אנשים שהעבודה תובעת מהם הרבה: אנשי הייטק, מנהלות ומנהלים, ומי
            שהעומס והלחץ כבר נכנסים איתם הביתה. נעבוד יחד בשיחות בזום, בקצב
            שמתאים לחיים עמוסים.
          </p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-4">
              <BookingButton>לתיאום שיחת היכרות ללא עלות</BookingButton>
              <CtaLink href="#approach" variant="ghost">
                איך אני עובדת
              </CtaLink>
            </div>
            <PhoneCallout />
          </div>
        </div>
        <PortraitSlot />
      </div>
    </section>
  );
}
