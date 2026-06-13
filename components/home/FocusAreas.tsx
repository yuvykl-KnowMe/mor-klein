const AREAS = [
  {
    title: "קריירה",
    body: "עומס שלא נגמר, אחריות שמכבידה, והתחושה שאתם רצים כל היום ועדיין לא מספיקים. שחיקה, חרדת ביצוע, וקושי אמיתי לנתק בסוף היום. לצד אלה גם הצמתים הגדולים: התלבטות בין מסלולים, רצון לשנות כיוון, או תחושת תקיעות שקשה לפענח. נבין יחד מה חשוב לכם ומה עוצר אתכם, כדי שתמשיכו בלי לשלם על זה בבריאות ובשקט הנפשי.",
  },
  {
    title: "זוגיות",
    body: "לפעמים הלחץ לא נשאר במשרד והוא נכנס איתכם הביתה: קוצר רוח, ריחוק, וויכוחים שחוזרים על עצמם. אבל זוגיות מגיעה לטיפול גם בזכות עצמה, כשרוצים להבין מחדש את הקשר, לתקשר אחרת, או להתקרב שוב אחרי תקופה של ריחוק. מרחב לשני בני הזוג יחד, או לעבודה אישית על הקשר.",
  },
  {
    title: "הורות צעירה",
    body: "המעבר להורות מטלטל גם כשהוא נרצה ומתוכנן: החודשים הראשונים, חוסר השינה, והזהות שמשתנה. יש מי שמגיעים עם הציפייה לילד, עם לידה מורכבת, או עם הקושי להיכנס לתפקיד החדש. וכשגם הקריירה תובענית, משהו תמיד נמתח. מקום לעבד את כל אלה בלי שיפוט ובלי הנחות מוקדמות.",
  },
];

export function FocusAreas() {
  return (
    <section aria-labelledby="areas-heading">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
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
              className="rounded-2xl border border-line bg-surface p-6 transition duration-500 ease-out hover:border-accent motion-safe:hover:-translate-y-1"
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
