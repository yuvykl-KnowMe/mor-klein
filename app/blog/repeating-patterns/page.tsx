import type { Metadata } from "next";
import Link from "next/link";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("repeating-patterns");

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
            האם קרה לכם שמצאתם את עצמכם אומרים: ״איך שוב הגעתי למצב
            הזה?״ אולי אתם מוצאים את עצמכם שוב ושוב במערכות יחסים דומות. אולי
            אתם מתקשים להציב גבולות, נמנעים מעימותים, דוחים החלטות חשובות או
            מרגישים שלא משנה כמה אתם מנסים, משהו ממשיך לחזור על עצמו. לפעמים נדמה
            שאנחנו מחליפים מקומות, אנשים או נסיבות, אבל העלילה נשארת כמעט אותה
            עלילה. למה זה קורה?
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading}>מה הם בכלל דפוסים?</h2>
          <div className={proseBody}>
            <p>
              דפוסים הם דרכי חשיבה, רגש והתנהגות שפיתחנו לאורך החיים. הם אינם
              נוצרים במקרה. למעשה, רובם התפתחו מתוך ניסיון להתמודד עם העולם, להבין
              אותו ולהרגיש בו בטוחים יותר.
            </p>
            <p>
              בילדותנו אנחנו לומדים מסקנות רבות על עצמנו ועל הסביבה: האם אפשר
              לסמוך על אנשים? האם אני מספיק טוב? האם כדאי לבקש עזרה? האם בטוח
              להביע רגשות? האם אני צריך לרצות אחרים כדי להיות אהוב? המסקנות האלה
              אינן תמיד מודעות, אך הן הופכות בהדרגה לעדשות שדרכן אנחנו מפרשים את
              המציאות.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>
            אנחנו לא מגיבים למציאות עצמה, אלא למשמעות שאנחנו נותנים לה
          </h2>
          <div className={proseBody}>
            <p>
              שני אנשים יכולים לחוות את אותו אירוע ולהגיב אליו בצורה שונה לחלוטין.
              למשל, ביקורת מהמנהל יכולה להתפרש אצל אדם אחד כהזדמנות ללמוד ולהשתפר,
              ואצל אדם אחר כהוכחה לכך שהוא לא מספיק טוב. האירוע דומה, אבל המשמעות
              שכל אחד מעניק לו שונה.
            </p>
            <p>
              המשמעויות הללו נבנות לאורך החיים, מתוך חוויות מוקדמות, מערכות היחסים
              שבהן גדלנו והאמונות שפיתחנו על עצמנו ועל העולם. לכן פעמים רבות אנחנו
              מוצאים את עצמנו מגיבים באופן אוטומטי, גם כאשר הנסיבות כבר שונות
              מבעבר.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>גם לדפוסים שמכאיבים לנו יש היגיון</h2>
          <div className={proseBody}>
            <p>
              אחת ההבנות המשמעותיות בטיפול היא שגם לדפוסים שאנחנו רוצים להיפטר מהם
              יש בדרך כלל סיבה טובה.
            </p>
            <p>
              אדם שמתקשה לסמוך על אחרים אולי למד בעבר שאכזבה היא דבר שכדאי להיערך
              אליו. אדם שמרצה את כולם אולי גילה בשלב מוקדם בחייו שקבלה ואהבה מגיעות
              כשהוא מתחשב בצרכים של אחרים לפני שלו. אדם שנמנע מאתגרים חדשים אולי
              מנסה להגן על עצמו מפני תחושת כישלון או ביקורת.
            </p>
            <p>
              הדפוסים הללו לא נוצרו כדי לפגוע בנו. להפך. במידה מסוימת הם עזרו לנו
              להתמודד, להשתייך, להרגיש בטוחים או לקבל הכרה. הבעיה היא שלפעמים מה
              שעזר לנו בעבר כבר לא משרת אותנו בהווה.
            </p>
            <p>
              הרעיון הזה, ש
              <Link
                href="/blog/adlerian-therapy-explained"
                className={proseLink}
              >
                לכל התנהגות יש מטרה
              </Link>
              , הוא אחד מאבני היסוד של הגישה האדלריאנית.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>אז למה כל כך קשה לשנות אותם?</h2>
          <div className={proseBody}>
            <p>
              כי דפוסים מעניקים לנו תחושת היכרות וביטחון. גם כאשר הם גובים מאיתנו
              מחיר, הם מוכרים לנו. לעומת זאת, שינוי דורש מאיתנו לנסות משהו חדש,
              ולעיתים גם להתמודד עם פחדים ישנים.
            </p>
            <p>
              להציב גבול כשאנחנו רגילים לרצות. לבקש עזרה כשאנחנו רגילים להסתדר
              לבד. להישאר בקשר גם כשעולה החשש מדחייה. לקחת סיכון גם כשאין ודאות
              לגבי התוצאה. זה לא פשוט, ולכן שינוי הוא בדרך כלל תהליך ולא החלטה
              חד-פעמית.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>איך מתחילים ליצור בחירות חדשות?</h2>
          <div className={proseBody}>
            <p>
              הצעד הראשון הוא לא להילחם בעצמנו, אלא להבין את עצמנו. במקום לשאול
              ״למה אני כזה?״, אפשר לשאול ״מה למדתי על עצמי ועל
              העולם שגורם לי לפעול כך?״.
            </p>
            <p>
              כשמבינים את ההיגיון שמאחורי הדפוס, אפשר להתחיל לבחון האם הוא עדיין
              מתאים לחיים שאנחנו רוצים לחיות היום. לאט לאט נוצרת אפשרות לבחור אחרת.
              לא משום שהעבר נעלם, אלא משום שאנחנו כבר לא חייבים להגיב אליו באופן
              אוטומטי.
            </p>
            <p>
              על{" "}
              <Link href="/blog/childhood-and-present" className={proseLink}>
                האופן שבו הדפוסים והאמונות האלה נוצרים בילדות
              </Link>
              , ולמה הבנתם אינה האשמת ההורים, הרחבתי במאמר נפרד.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>שינוי לא מתחיל בלהפוך לאדם אחר</h2>
          <div className={proseBody}>
            <p>
              אחת התפיסות שאני אוהבת במיוחד היא ששינוי אינו מחייב למחוק את מי
              שאנחנו או את הסיפור שממנו באנו. הוא מתחיל כאשר אנחנו מבינים את הסיפור
              שלנו לעומק, מזהים את הבחירות האוטומטיות שאנחנו עושים, ומגלים שיש לנו
              יותר אפשרויות ממה שחשבנו.
            </p>
            <p>
              לפעמים עצם ההבנה הזאת היא הצעד הראשון בדרך לדפוס חדש. דפוס שמבוסס
              פחות על הישרדות והרגל, ויותר על בחירה, חופש והחיים שאנחנו רוצים
              ליצור לעצמנו.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
