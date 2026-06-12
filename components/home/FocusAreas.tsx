const AREAS = [
  {
    title: "קריירה",
    body: "התלבטות בין מסלולים, שחיקה, תחושת תקיעות או רצון אמיתי לשינוי. נבין יחד מה חשוב לכם, מה עוצר אתכם, ואיך נראה הצעד הבא שלכם.",
  },
  {
    title: "זוגיות",
    body: "ויכוחים שחוזרים על עצמם, ריחוק שהתגנב לאט, או רצון להעמיק את הקשר. מרחב לשני בני הזוג יחד — או לעבודה אישית על הזוגיות.",
  },
  {
    title: "הורות צעירה",
    body: "הציפייה לילד, החודשים הראשונים, והשינוי בזהות, בזוגיות ובסדר היום. מקום לעבד את מה שעובר עליכם — בלי שיפוט ובלי הנחות מוקדמות.",
  },
];

export function FocusAreas() {
  return (
    <section aria-labelledby="areas-heading">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <h2
          id="areas-heading"
          className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl"
        >
          במה אני מלווה
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {AREAS.map((area) => (
            <li
              key={area.title}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <h3 className="font-heading text-xl font-semibold">
                {area.title}
              </h3>
              <p className="mt-3 text-ink-muted">{area.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
