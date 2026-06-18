import type { Metadata } from "next";

export const metadata: Metadata = {
  // Parent template appends " | מור קליין", yielding the spec title.
  title: "שאלות נפוצות על טיפול",
  description:
    "תשובות לשאלות נפוצות על טיפול נפשי, הגישה האדלריאנית, טיפול בזום ועוד.",
  alternates: { canonical: "/faq" },
};

// Single source for both the rendered accordion and the FAQ structured data.
// Hebrew preserved exactly as provided (incl. dashes and third-person "מור").
const faqs = [
  {
    q: "האם ניתן להגיע לטיפול פנים אל פנים?",
    a: "כן. הפגישות מתקיימות בזום או פנים אל פנים בהרצליה — לפי מה שמתאים לך. רוב המטופלים בוחרים בזום בגלל הנוחות והגמישות: אין נסיעה, אין חניה, אפשר להיכנס לפגישה מהבית או מהמשרד. אבל אם פגישה פיזית מתאימה לך יותר, או שאתה מעדיף שילוב של שניהם — זה בהחלט אפשרי.",
  },
  {
    q: "מה ההבדל בין פסיכותרפיסט לפסיכולוג?",
    a: "פסיכולוג הוא תואר מוגן בחוק הישראלי — מחייב לימוד אקדמי ספציפי ורישוי ממשרד הבריאות. פסיכותרפיסט הוא כינוי לאנשי מקצוע שעברו הכשרה טיפולית מעמיקה, ביניהם עובדים סוציאליים קליניים. מור היא עובדת סוציאלית קלינית M.S.W ופסיכותרפיסטית מוסמכת מטעם מכון אדלר — שתי הכשרות נפרדות ומשלימות.",
  },
  {
    q: "מה זה טיפול אדלריאני ובמה הוא שונה?",
    a: "הגישה האדלריאנית מניחה שבני אדם מונעים על ידי שייכות ומשמעות, לא על ידי דחפים. הטיפול מבין איך נרטיבים ודפוסים שנוצרו בעבר משפיעים על ההווה, ועוזר לבנות כיוון ברור יותר קדימה. הדגש הוא על קשר טיפולי שוויוני, הבנת המניעים מאחורי ההתנהגות, ובחירה מודעת.",
  },
  {
    q: "כמה זמן נמשך טיפול בדרך כלל?",
    a: "אין תשובה אחת. יש אנשים שרואים שינוי תוך 3–4 חודשים; אחרים בוחרים תהליך עמוק יותר שנמשך שנה ומעלה. בתחילת הטיפול נשוחח על המטרות והציפיות ונחליט יחד על קצב ומשך שמתאים לך.",
  },
  {
    q: "מה קורה בפגישה הראשונה?",
    a: "הפגישה הראשונה היא פגישת היכרות. אשאל על מה הביא אותך, מה עובר עליך ומה אתה מקווה שהטיפול יסייע לך לשנות או להבין. אין ציפייה שתביא נאום מוכן.",
  },
  {
    q: "מה מדיניות הביטולים?",
    a: "ביטול עד 24 שעות לפני הפגישה — ללא חיוב. ביטול מאוחר יותר ייגבה בהתאם למדיניות שנסכים עליה בתחילת הטיפול.",
  },
  {
    q: "האם הטיפול חסוי לחלוטין?",
    a: "כן. הטיפול כפוף לחובת הסודיות המקצועית. מידע לא יועבר לשום גורם ללא הסכמתך המפורשת — למעט במצבים חריגים הקבועים בחוק. בתחילת הטיפול נחתום על טופס הסכמה שמסביר זאת בפירוט.",
  },
  {
    q: "האם מור עובדת עם ביטוח בריאות או קופות חולים?",
    a: "לא. הטיפול הוא פרטי לחלוטין. חלק מחברות הביטוח הפרטיות מאפשרות החזר חלקי — כדאי לבדוק מול הפוליסה שלך. מור מנפיקה חשבונית מס קבלה לצורך הגשה לביטוח.",
  },
  {
    q: "איך יודעים שטיפול עובד?",
    a: "השינוי בטיפול לא תמיד מרגיש דרמטי. לרוב מגיע כהכרה הדרגתית — תגובה שונה במצב שהיה מוציא אותך מהפסים, הבנה טובה יותר של מה מניע אותך, תחושה שיש יותר אפשרויות בחירה. נבדוק את ההתקדמות יחד לאורך הדרך.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Faq() {
  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
          <h1
            id="faq-heading"
            className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
          >
            שאלות ותשובות
          </h1>

          {/* Native <details> accordion: keyboard-accessible and fully usable
              without JS. No client component needed. */}
          <div className="mt-10 flex flex-col gap-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 ease-out hover:border-accent"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 shrink-0 text-accent-deep transition-transform duration-300 ease-out group-open:rotate-180"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
