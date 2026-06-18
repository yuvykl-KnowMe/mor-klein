import type { Metadata } from "next";
import { Blob, Float, LineArc } from "@/components/decor/Decor";
import { Reveal } from "@/components/decor/Reveal";
import { Branch, Dots, Leaf } from "@/components/decor/WabiSabi";
import { PHONE_TEL, SITE_NAME, SITE_URL } from "@/lib/site";

// Name-first title (bypasses the parent "%s | מור קליין" template) and
// description, reused for the document head and Open Graph so they stay in sync.
const PAGE_TITLE =
  "מור קליין | עובדת סוציאלית קלינית (M.A.) ופסיכותרפיסטית אדלריאנית";
const PAGE_DESCRIPTION =
  "עובדת סוציאלית קלינית (M.A.) ופסיכותרפיסטית אדלריאנית. טיפול אישי בזום או פנים אל פנים בהרצליה. התמחות בקריירה, זוגיות והורות צעירה.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: SITE_NAME,
    url: "/about",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// Person structured data. URLs stay non-www to match SITE_URL / metadataBase
// and the home page graph (the apex 308-redirects to www in production).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  jobTitle: "עובדת סוציאלית קלינית (M.A.) ופסיכותרפיסטית אדלריאנית",
  url: SITE_URL,
  telephone: PHONE_TEL,
};

export default function About() {
  return (
    <main id="main" className="relative isolate flex-1 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Quieter version of the home page's woven decoration: a couple of soft
          gold blobs and a few slate line motifs, low opacity, gentle drift.
          Decorative + aria-hidden; motion is gated on prefers-reduced-motion. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Float className="-end-16 top-[8%] h-64 w-64" speed={0.14} reveal={false}>
          <Blob />
        </Float>
        <Float className="-start-20 top-[60%] h-72 w-72" speed={-0.16} reveal={false}>
          <Blob />
        </Float>
        <Float className="start-[2%] top-[15%] w-20 opacity-40" speed={-0.3}>
          <Leaf className="-rotate-6" />
        </Float>
        <Float className="end-[3%] top-[42%] w-36 opacity-35" speed={0.34}>
          <LineArc className="rotate-3" />
        </Float>
        <Float className="start-[4%] top-[74%] w-24 opacity-35" speed={0.36}>
          <Branch className="-scale-x-100" />
        </Float>
        <Float className="end-[6%] top-[88%] w-9 opacity-50" speed={-0.3}>
          <Dots />
        </Float>
      </div>

      <section aria-labelledby="about-heading">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
          <Reveal>
            <h1
              id="about-heading"
              className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
            >
              מור קליין, עובדת סוציאלית קלינית (M.A.) ופסיכותרפיסטית אדלריאנית
            </h1>
            <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
              <p>
                שלום, אני מור. אני עובדת סוציאלית קלינית (M.A.) ופסיכותרפיסטית
                אדלריאנית, ואני מלווה אנשים בגילאי העשרים עד הארבעים בצמתים
                המשמעותיים של החיים הבוגרים: התלבטויות סביב קריירה, מערכות יחסים
                וזוגיות, והמעבר להורות צעירה.
              </p>
              <p>
                חלק גדול מהאנשים שאני פוגשת חיים בקצב תובעני, אנשי הייטק, מנהלות
                ומנהלים ובעלי אחריות גדולה. העומס והלחץ מהעבודה לא תמיד נשארים
                במשרד, הם נכנסים הביתה, אל הזוגיות, אל ההורות ואל היחס שלנו
                לעצמנו.
              </p>
              <p>
                חלק מהאנשים שמגיעים אליי יודעים בדיוק מה מטריד אותם, ואחרים פשוט
                מרגישים שמשהו תקוע ולא לגמרי ברור. גם עבודה על זוגיות ומערכות
                יחסים מתרחשת לעיתים קרובות בתוך טיפול אישי, מתוך הצד שלכם בקשר.
              </p>
              <p>
                רוב הפגישות מתקיימות בזום, וזו לרוב הבחירה הנוחה: בלי נסיעה ובלי
                חניה, מתאימה את עצמה ללוח זמנים עמוס, ומאפשרת להתחיל תהליך מכל
                מקום שנוח לכם, מהבית או מהמשרד. למי שמעדיף מפגש פנים אל פנים, אני
                מקבלת גם בקליניקה בהרצליה.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14 sm:mt-16">
            <h2 className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl">
              הגישה שלי, במילים פשוטות
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
              <p>
                אני עובדת בגישה האדלריאנית, ובבסיסה אמונה אופטימית באדם. אנחנו לא
                נקבעים על ידי העבר שלנו: הוא מעצב אותנו, אבל הוא לא גזר דין. כל
                התנהגות, גם זו שמכבידה, נושאת מטרה והיגיון פנימי שאפשר להבין.
              </p>
              <p>
                בני אדם זקוקים לתחושת שייכות ומשמעות, והרבה ממה שאנחנו עושים נובע
                מהחיפוש אחריהן. ושינוי אמיתי דורש שני דברים יחד: הבנה חדשה מצד
                אחד, וצעדים מעשיים בחיים עצמם מצד שני.
              </p>
              <p className="border-s-2 border-accent ps-5 text-ink">
                אני מאמינה שכל אדם עושה את הטוב ביותר שהוא יודע באותו רגע, ושבתוכו
                קיימים הכוחות לצמוח, להשתנות וליצור לעצמו חיים בעלי משמעות
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14 sm:mt-16">
            <h2 className="font-heading text-2xl font-bold leading-[1.3] sm:text-3xl">
              הרקע המקצועי שלי
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-lg text-ink-muted">
              <p>
                אני פסיכותרפיסטית אדלריאנית מוסמכת, בוגרת התוכנית התלת-שנתית של
                מכון אדלר. שלוש שנות הכשרה ועבודה קלינית בהדרכה צמודה לימדו אותי
                עד כמה השינוי מתחיל בתוך קשר אנושי אמיתי, ולא רק בהבנה שכלית.
              </p>
              <p>
                לצד ההכשרה הטיפולית אני עובדת סוציאלית קלינית, בעלת תואר שני
                (M.A.) בעבודה סוציאלית מאוניברסיטת בר-אילן, ואני רשומה בפנקס
                העובדים הסוציאליים של משרד הרווחה. את דרכי האקדמית התחלתי בתואר
                ראשון (B.A.) במדעי ההתנהגות במכללה למינהל.
              </p>
              <p>
                לאורך הדרך צברתי ניסיון קליני במגוון מסגרות: כמטפלת פרטנית בבית
                החולים לילדים שניידר, כמטפלת פרטנית וקבוצתית בתחנה לבריאות הנפש
                בחולון, וכמטפלת פרטנית ביחידה לטיפול בהתמכרויות באגף הרווחה
                בחולון. המפגש עם אנשים בנקודות שונות כל כך בחייהם לימד אותי עד כמה
                כל סיפור הוא יחיד, ועד כמה הרצון לחיות אחרת משותף לכולנו.
              </p>
              <p>
                ומעבר למקצוע, אני נשואה ואמא לשלוש בנות, והמעבר להורות, על השמחה
                והטלטלה שבו, מוכר לי לא רק מחדר הטיפול אלא גם מהחיים עצמם.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14 sm:mt-16">
            <p className="text-lg text-ink">
              יותר מכל אני מאמינה שהקשר הטיפולי עצמו הוא שמאפשר את השינוי, ואני
              כאן כדי ללוות אתכם בו בכבוד, בסקרנות ובלי שיפוט.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
