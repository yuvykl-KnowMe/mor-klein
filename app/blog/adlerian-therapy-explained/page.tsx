import type { Metadata } from "next";
import Link from "next/link";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("adlerian-therapy-explained");

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: postPath(post.slug) },
  openGraph: {
    type: "article",
    locale: "he_IL",
    siteName: SITE_NAME,
    url: postPath(post.slug),
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
  },
};

// Article structured data. URLs stay non-www to match SITE_URL / metadataBase.
// Dates reflect creation; bump dateModified when the body content lands.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  inLanguage: "he",
  author: { "@type": "Person", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}${postPath(post.slug)}`,
  },
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
};

// In-prose link pattern, matching /about and the home contact links.
const proseLink =
  "text-accent-deep underline underline-offset-4 transition-colors duration-300 ease-out hover:text-accent-deeper";
const sectionHeading =
  "font-heading text-2xl font-bold leading-[1.3] sm:text-3xl";
const proseBody = "mt-6 flex flex-col gap-4 text-lg text-ink-muted";

export default function Post() {
  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
        <h1 className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl">
          {post.title}
        </h1>

        <div className={proseBody}>
          <p>
            אם אי פעם תהית למה אנשים מגיבים בצורה כל כך שונה לאותם אירועי חיים, או
            למה אנחנו ממשיכים להיתקל שוב ושוב באותם דפוסים במערכות יחסים, בעבודה
            או מול עצמנו, הגישה האדלריאנית מציעה זווית הסתכלות מעניינת. רבים מגיעים
            לטיפול כשהם רוצים להבין למה הם מרגישים כפי שהם מרגישים, למה הם תקועים
            במקום מסוים או למה קשה להם ליצור את השינוי שהם מייחלים לו. הגישה
            האדלריאנית מסייעת להבין את הסיפור שהביא אותנו עד לכאן, אך לא פחות חשוב
            מכך, היא עוזרת לנו לחשוב לאן אנחנו רוצים להמשיך מכאן.
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading}>אדלר מול פרויד, מה ההבדל?</h2>
          <div className={proseBody}>
            <p>
              כשחושבים על פסיכולוגיה, רבים מכירים את זיגמונד פרויד, שהדגיש את
              השפעתם של חוויות הילדות והכוחות הלא מודעים על חיינו. אלפרד אדלר, שהיה
              בתחילת דרכו חלק מהמעגל המקצועי של פרויד, הציע הסתכלות מעט שונה. הוא
              האמין שהעבר אכן משפיע עלינו, אך הוא אינו קובע באופן מוחלט את מי
              שנהיה.
            </p>
            <p>
              במילים פשוטות, אם פרויד שאל ״מה קרה לך?״, אדלר הוסיף שאלה
              נוספת: ״ולאן אתה רוצה להגיע?״ הגישה האדלריאנית מתעניינת לא
              רק במה שעיצב אותנו, אלא גם במטרות, בתקוות ובכיוון שאליו אנחנו
              שואפים.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>כולנו רוצים להרגיש שייכים</h2>
          <div className={proseBody}>
            <p>
              אחד הרעיונות המרכזיים ביותר בתיאוריה של אדלר הוא שתחושת שייכות היא
              צורך אנושי בסיסי. כולנו רוצים להרגיש שיש לנו מקום, שאנחנו חשובים
              למישהו, שאנחנו חלק ממשהו גדול יותר מעצמנו.
            </p>
            <p>
              כאשר אדם מרגיש שייך, הוא בדרך כלל חווה יותר ביטחון, מסוגלות ויכולת
              להתמודד עם אתגרי החיים. לעומת זאת, כאשר תחושת השייכות נפגעת, עלולות
              להופיע תחושות של בדידות, דחייה, חוסר ערך או מאבק מתמשך להוכיח את
              עצמנו.
            </p>
            <p>
              לעיתים, גם קשיים שנראים על פני השטח שונים לחלוטין, חרדה, ריצוי, קושי
              ביצירת קשרים או ביקורת עצמית נוקשה, קשורים בדרך כזו או אחרת לשאלה
              האנושית הבסיסית: ״האם יש לי מקום?״
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>לכל התנהגות יש מטרה</h2>
          <div className={proseBody}>
            <p>
              רעיון מרכזי נוסף בגישה האדלריאנית הוא שהתנהגות אינה מקרית. כאשר
              אנחנו עושים משהו שוב ושוב, גם אם הדבר פוגע בנו או מתסכל אותנו, בדרך
              כלל יש לכך סיבה. במקום לשאול ״מה לא בסדר איתי?״, אפשר לשאול
              ״מה ההתנהגות הזאת מנסה להשיג עבורי?״. כשמבינים את ההיגיון
              הזה, אפשר להתחיל לבחון האם הדפוס עדיין משרת אותנו.
            </p>
            <p>
              הרחבתי על{" "}
              <Link href="/blog/repeating-patterns" className={proseLink}>
                הדפוסים שחוזרים על עצמם
              </Link>
              , ולמה כל כך קשה לשנות אותם, במאמר נפרד.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>אז איך זה נראה בפועל בטיפול?</h2>
          <div className={proseBody}>
            <p>
              בטיפול אדלריאני אנחנו מנסים להבין יחד כיצד האדם למד לראות את עצמו,
              את האחרים ואת העולם. אנחנו בוחנים אילו אמונות התפתחו לאורך השנים,
              אילו דפוסים מלווים אותו כיום, ואיך כל אלה משפיעים על הבחירות שהוא
              עושה ועל מערכות היחסים בחייו.
            </p>
            <p>
              אבל הטיפול אינו נשאר רק ברמת ההבנה. המטרה היא לחבר בין התובנות לבין
              החיים עצמם, לעזור לאדם לזהות את הכוחות שלו, לגבש כיוון שחשוב לו
              ולבנות צעדים שיאפשרו לו להתקדם לעברו.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>למה הגישה הזאת רלוונטית גם היום?</h2>
          <div className={proseBody}>
            <p>
              אולי משום שהיא מזכירה לנו משהו חשוב: אנחנו לא רק תוצאה של מה שקרה
              לנו. גם כאשר אנחנו נושאים איתנו פצעים, אכזבות או דפוסים ישנים, עדיין
              קיימת האפשרות לבחור כיצד להתייחס אליהם ולאן לכוון את חיינו מכאן.
            </p>
            <p>
              על{" "}
              <Link href="/blog/childhood-and-present" className={proseLink}>
                הקשר בין העבר להווה
              </Link>
              , ולמה הבנת הילדות אינה האשמת ההורים, הרחבתי במאמר נפרד.
            </p>
            <p>
              זו אחת הסיבות שאני כל כך מתחברת לגישה האדלריאנית. היא משלבת בין הבנה
              עמוקה של האדם לבין אמונה ביכולת שלו לצמוח, להשתנות וליצור לעצמו חיים
              בעלי משמעות, שייכות ותקווה.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
