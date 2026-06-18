import type { Metadata } from "next";
import Link from "next/link";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("childhood-and-present");

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
  "@graph": [
    {
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "מאמרים",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${SITE_URL}${postPath(post.slug)}`,
        },
      ],
    },
  ],
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
            אחת השאלות שאני שומעת לא פעם היא: ״למה בטיפול תמיד חוזרים
            לילדות?״ ולפעמים השאלה מגיעה עם חשש נוסף: ״אני לא רוצה
            להאשים את ההורים שלי.״
          </p>
          <p>
            זו שאלה חשובה. ואולי דווקא בגלל זה כדאי להתחיל מהתשובה הפשוטה: המטרה
            של טיפול אינה לחפש אשמים. המטרה היא להבין. להבין איך הפכנו להיות מי
            שאנחנו, איך למדנו לראות את עצמנו ואת העולם, ואיך החוויות שעברנו
            ממשיכות להשפיע על הבחירות שאנחנו עושים גם היום.
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading}>למה בכלל מסתכלים על הילדות?</h2>
          <div className={proseBody}>
            <p>
              הילדות היא התקופה שבה אנחנו לומדים את הדברים הבסיסיים ביותר על
              החיים. דרך מערכות היחסים הראשונות שלנו אנחנו מפתחים תפיסות לגבי
              עצמנו, לגבי אחרים ולגבי העולם.
            </p>
            <p>
              בלי לשים לב, אנחנו מתחילים לענות על שאלות כמו: האם אני חשוב? האם
              אפשר לסמוך על אנשים? מה צריך לעשות כדי להיות אהוב? האם מותר לי לטעות?
              האם כדאי לבקש עזרה? האם יש לי מקום? התשובות לשאלות האלה לא נלמדות
              בדרך כלל במילים. הן נבנות מתוך חוויות, מסרים, קשרים ואירועים שאנחנו
              פוגשים לאורך הדרך.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>איך נוצרים אמונות ודפוסים?</h2>
          <div className={proseBody}>
            <p>
              כולנו מנסים להבין את העולם שבו אנחנו חיים. כילדים, אנחנו אוספים
              רמזים ומסיקים מסקנות.
            </p>
            <p>
              למשל, ילד שחווה ביקורת רבה עשוי להסיק שעליו להיות מושלם כדי להיות
              מוערך. ילדה שלמדה להסתדר לבד מגיל צעיר עשויה להסיק שבקשת עזרה היא
              סימן לחולשה. ילד שחש שלא רואים אותו עלול ללמוד שעליו להתאמץ מאוד כדי
              לקבל תשומת לב והכרה.
            </p>
            <p>
              עם השנים המסקנות הללו הופכות לאמונות עמוקות, ולעיתים גם לדפוסים
              שמלווים אותנו בבגרות. הבעיה היא שלא תמיד אנחנו מודעים להן. אנחנו פשוט
              פועלים לפיהן כאילו הן עובדות חיים ברורות מאליהן.
            </p>
            <p>
              על{" "}
              <Link href="/blog/repeating-patterns" className={proseLink}>
                האופן שבו הדפוסים האלה ממשיכים לחזור על עצמם בבגרות
              </Link>
              , ולמה כל כך קשה לשנות אותם, הרחבתי במאמר נפרד.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>להבין את העבר זה לא להיתקע בו</h2>
          <div className={proseBody}>
            <p>
              אחת הטעויות הנפוצות היא לחשוב שטיפול עוסק בחפירה אינסופית בעבר.
              בעיניי, המטרה אינה להישאר שם.
            </p>
            <p>
              העבר חשוב משום שהוא מספק לנו מפה. הוא עוזר להבין איך נוצרו דרכי
              החשיבה, הרגש וההתנהגות שלנו. אבל הבנת המפה אינה היעד. היעד הוא להבין
              כיצד הדברים הללו משפיעים על החיים שלנו כיום.
            </p>
            <p>
              למשל, אדם שמתקשה לסמוך על אחרים לא בהכרח צריך לבלות שנים בניתוח כל
              אכזבה שחווה בילדותו. אבל ההבנה מאיפה נוצר הקושי יכולה לעזור לו להבין
              את עצמו בחמלה רבה יותר וליצור אפשרויות חדשות בהווה.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>ומה לגבי ההורים?</h2>
          <div className={proseBody}>
            <p>
              ברוב המקרים, הורים פועלים מתוך הכוחות, הידע והמשאבים שהיו להם באותה
              תקופה. גם הם גדלו בתוך סיפור משלהם.
            </p>
            <p>
              לכן, המטרה אינה לחלק ציונים להורים או להכריע מי צדק ומי טעה. המטרה
              היא להבין אילו חוויות השפיעו עלינו, אילו מסרים לקחנו איתנו, ואיך הם
              ממשיכים לפעול בתוכנו גם היום. אפשר להכיר בהשפעה של העבר מבלי להפוך
              אותו לכתב אישום.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>לקחת אחריות על ההווה</h2>
          <div className={proseBody}>
            <p>
              הבנת העבר יכולה להיות משחררת, אבל היא אינה פוטרת אותנו מאחריות על
              חיינו כיום. להפך. ככל שאנחנו מבינים טוב יותר את הסיפור שלנו, כך גדלה
              היכולת שלנו לבחור כיצד להמשיך אותו.
            </p>
            <p>
              אולי לא בחרנו את כל מה שקרה לנו. לא בחרנו את המשפחה שבה נולדנו, את
              התנאים שבהם גדלנו או את כל החוויות שעיצבו אותנו. אבל כבוגרים, אנחנו
              יכולים לבחור כיצד להתייחס אל החוויות האלה, אילו משמעויות לתת להן,
              ואילו חיים אנחנו רוצים ליצור מכאן והלאה.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>אז למה חשוב להכיר את הסיפור שלנו?</h2>
          <div className={proseBody}>
            <p>
              כי קשה לשנות משהו שאנחנו לא מבינים. כאשר אנחנו מכירים את הדרך שעברנו,
              אנחנו יכולים לזהות אילו אמונות ודפוסים עדיין משרתים אותנו ואילו כבר
              פחות מתאימים לחיינו היום.
            </p>
            <p>
              העבר אינו גזר דין, אבל הוא בהחלט חלק מהסיפור. וטיפול, בעיניי, הוא
              המקום שבו אפשר להכיר את הסיפור הזה לעומק, לא כדי להישאר בו, אלא כדי
              לבחור בצורה חופשית יותר את הפרק הבא.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
