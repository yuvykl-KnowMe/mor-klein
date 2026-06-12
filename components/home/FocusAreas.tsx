const AREAS = [
  {
    title: "קריירה ולחץ בעבודה",
    body: "עומס שלא נגמר, אחריות שמכבידה, והתחושה שאתם רצים כל היום ועדיין לא מספיקים. שחיקה, חרדת ביצוע, וקושי אמיתי לנתק בסוף היום. נעבוד על הגבולות, על הלחץ, ועל מה שבאמת חשוב לכם, כדי שתוכלו להמשיך בלי לשלם על זה בבריאות ובשקט הנפשי.",
  },
  {
    title: "זוגיות",
    body: "הלחץ לא נשאר במשרד, הוא נכנס איתכם הביתה. קוצר רוח, ריחוק, וויכוחים שחוזרים על עצמם כשלא נשארה אנרגיה לזוגיות. מרחב לשני בני הזוג יחד, או לעבודה אישית על הקשר.",
  },
  {
    title: "הורות צעירה",
    body: "כשקריירה תובענית פוגשת הורות טרייה, משהו תמיד נמתח. החודשים הראשונים, חוסר השינה, והניסיון להחזיק את הכול ביחד. מקום לעבד את השינוי בזהות ובסדר היום, בלי שיפוט ובלי הנחות מוקדמות.",
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
