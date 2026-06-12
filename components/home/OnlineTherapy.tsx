const BENEFITS = [
  {
    text: "מהמרחב שלכם — בבית, על הספה, בלי חדר המתנה ובלי דרך חזרה ארוכה הביתה.",
    icon: (
      // Home
      <path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5" />
    ),
  },
  {
    text: "בלי נסיעות ובלי פקקים — קל יותר לשמור על רצף ולהתמיד לאורך זמן.",
    icon: (
      // Clock
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2" />
    ),
  },
  {
    text: "מכל מקום בארץ או בעולם — גם אם תעברו דירה או תיסעו, הטיפול ממשיך איתכם.",
    icon: (
      // Globe
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c-2.5 2.5-3.7 5.6-3.7 9s1.2 6.5 3.7 9c2.5-2.5 3.7-5.6 3.7-9S14.5 5.5 12 3Z" />
    ),
  },
];

export function OnlineTherapy() {
  return (
    <section aria-labelledby="online-heading">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
          <h2
            id="online-heading"
            className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl"
          >
            הטיפול מתקיים אונליין בזום — וזה יתרון
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            שיחה טובה לא תלויה בחדר. היא תלויה בקשר, בקשב ובתחושת ביטחון — ואת
            אלה אפשר לבנות גם מרחוק.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit.text} className="flex flex-col gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 stroke-sage-deep"
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
