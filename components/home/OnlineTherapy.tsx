const BENEFITS = [
  {
    text: "בלי נסיעות ובלי חיפוש חניה. חצי שעה שהייתה הולכת על הדרך נשארת אצלכם.",
    icon: (
      // Clock
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2" />
    ),
  },
  {
    text: "שיחה שנכנסת בין ישיבות, מהמשרד או מהבית, בלי לפנות חצי יום מהלו״ז.",
    icon: (
      // Calendar
      <path d="M7 3v3M17 3v3M4 8.5h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
    ),
  },
  {
    text: "גם בנסיעת עבודה או בשבוע עמוס במיוחד, קל יותר לשמור על רצף ולא לוותר על עצמכם.",
    icon: (
      // Globe
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c-2.5 2.5-3.7 5.6-3.7 9s1.2 6.5 3.7 9c2.5-2.5 3.7-5.6 3.7-9S14.5 5.5 12 3Z" />
    ),
  },
];

export function OnlineTherapy() {
  return (
    <section aria-labelledby="online-heading">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
        <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
          <h2
            id="online-heading"
            className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl"
          >
            טיפול שנכנס ללו״ז, לא נלחם בו
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            כשכל משבצת ביומן נלחמת על מקום, נסיעה לקליניקה היא מותרות. השיחות
            מתקיימות בזום ונבנות סביב הזמן שלכם, לא להפך.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit.text} className="flex flex-col gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 stroke-accent-deep"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {benefit.icon}
                </svg>
                <p className="text-ink-muted">{benefit.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
