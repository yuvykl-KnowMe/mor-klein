import type { Metadata } from "next";
import Link from "next/link";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("self-criticism");

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
            רבים מאיתנו מדברים לעצמנו בדרכים שלעולם לא היינו מדברים לאדם אחר. טעות
            קטנה בעבודה, משפט שאמרנו ולא היינו שלמים איתו, החלטה שלא הצליחה כפי
            שקיווינו, ומיד מופיע הקול הפנימי שמבקר, שופט ומזכיר לנו מה היינו
            צריכים לעשות אחרת.
          </p>
          <p>
            לפעמים הביקורת הזו כל כך מוכרת, שאנחנו כבר לא שמים לב שהיא שם. היא
            נשמעת כמו האמת. אבל למה בעצם אנחנו כל כך קשים עם עצמנו?
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading}>
            הביקורת העצמית לא נולדה כדי לפגוע בנו
          </h2>
          <div className={proseBody}>
            <p>
              למרות שהיא מכאיבה, לביקורת העצמית יש בדרך כלל כוונה חיובית. עבור
              אנשים רבים, היא התפתחה כניסיון להגן. להגן מפני טעויות, מפני דחייה,
              מפני כישלון, מפני ביקורת של אחרים.
            </p>
            <p>
              אי שם בדרך למדנו שאם נהיה מספיק ביקורתיים כלפי עצמנו, נצליח להשתפר,
              להימנע מטעויות או לעמוד בציפיות. הבעיה היא שבמקום לעודד צמיחה,
              הביקורת העצמית הופכת לעיתים קרובות למקור של לחץ, חרדה ושחיקה.
            </p>
            <p>
              גם כאן, כמו ב
              <Link href="/blog/repeating-patterns" className={proseLink}>
                דפוסים אחרים שאנחנו נתקעים בהם
              </Link>
              , מאחורי ההתנהגות מסתתר היגיון שניסה להגן עלינו.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>
            למה דווקא אנשים מצליחים נוטים להיות המבקרים הכי חריפים של עצמם?
          </h2>
          <div className={proseBody}>
            <p>
              מבחוץ זה יכול להיראות מפתיע. אנשים מוכשרים, אחראים ומצליחים הם פעמים
              רבות אלו שמרגישים שהם לא עושים מספיק, לא מספיק טובים או לא עומדים
              בסטנדרטים של עצמם.
            </p>
            <p>
              אחת הסיבות לכך היא שההישגים לא תמיד מרגיעים את הקול הביקורתי. כאשר
              הערך העצמי נשען בעיקר על הצלחה, כל טעות קטנה עלולה להרגיש כמו איום.
              במקום לעצור ולהכיר במה שכבר הושג, המבט מופנה מיד למה שחסר, למה שעדיין
              לא הושלם או למה שהיה יכול להיות טוב יותר. כך נוצר מרדף מתמשך אחרי
              ״מספיק טוב״, יעד שלעיתים נדמה שהוא תמיד זז עוד קצת קדימה.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>
            יש הבדל בין רצון להתפתח לבין שיפוט עצמי
          </h2>
          <div className={proseBody}>
            <p>
              חשוב לומר: אין שום דבר פסול בשאיפה להתפתח, ללמוד ולהשתפר. למעשה,
              הרצון לצמוח הוא חלק טבעי ובריא מהחיים. הבעיה מתחילה כאשר ההתפתחות
              מונעת מתוך פחד ולא מתוך סקרנות. כאשר כל טעות נתפסת כהוכחה לכישלון,
              כאשר הערך העצמי תלוי בביצועים, כאשר אין מקום לחולשה, למגבלות או
              לאנושיות.
            </p>
            <p>
              שאיפה להתפתחות אומרת: ״אני רוצה ללמוד ולהתקדם.״ שיפוט עצמי
              אומר: ״אם לא הצלחתי, כנראה שמשהו לא בסדר בי.״ ההבדל אולי
              נשמע קטן, אבל ההשפעה שלו על החיים גדולה מאוד.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>איך הביקורת העצמית משפיעה עלינו?</h2>
          <div className={proseBody}>
            <p>
              בניגוד למה שרבים חושבים, ביקורת עצמית אינה תמיד מניעה לפעולה. לעיתים
              היא דווקא יוצרת הימנעות. כשאנחנו מפחדים לטעות, אנחנו עלולים לדחות
              משימות, להימנע מאתגרים, לא לקחת סיכונים או להסתפק במה שמוכר ובטוח.
            </p>
            <p>
              לפעמים המחיר אינו רק מקצועי, אלא גם אישי. אנשים שמבקרים את עצמם ללא
              הרף מתקשים לעיתים ליהנות מהצלחותיהם, לחוש סיפוק או לראות את עצמם
              בעיניים טובות.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>
            אז איך מפתחים יחס פנימי מיטיב יותר?
          </h2>
          <div className={proseBody}>
            <p>
              הצעד הראשון הוא לזהות את הקול הביקורתי. לשים לב מתי הוא מופיע, מה הוא
              אומר ואילו רגשות הוא מעורר.
            </p>
            <p>
              הצעד השני הוא לנסות להבין אותו. במקום להילחם בו, אפשר לשאול: מה הוא
              מנסה להשיג עבורי? ממה הוא מנסה להגן עליי? לא פעם נגלה שמתחת לביקורת
              מסתתר פחד מכישלון, רצון להיות אהובים, צורך בהכרה או חשש לאכזב.
            </p>
            <p>
              לעיתים קרובות{" "}
              <Link href="/blog/childhood-and-present" className={proseLink}>
                הקול הביקורתי הזה נולד עוד בילדות
              </Link>
              , מתוך המסרים והחוויות המוקדמות שלנו.
            </p>
            <p>
              ומתוך ההבנה הזאת אפשר להתחיל לפתח קול פנימי נוסף. קול שמסוגל לראות גם
              את הכוחות, שמכיר במאמץ ולא רק בתוצאה, שמאפשר לטעות מבלי להתפרק. לא
              מדובר בוויתור על שאיפות או ב״הנחות״ לעצמנו, אלא ביצירת יחס
              שמאפשר צמיחה מתוך כבוד וקבלה, ולא מתוך מאבק בלתי פוסק.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>להיות אנושיים</h2>
          <div className={proseBody}>
            <p>
              בסופו של דבר, כולנו טועים, מתבלבלים, נכשלים ולומדים. זה לא סימן
              לחולשה. זו חלק מהחוויה האנושית.
            </p>
            <p>
              בעיניי, אחד הדברים המשמעותיים ביותר שאדם יכול לפתח הוא היכולת להיות
              לצד עצמו גם ברגעים שבהם הדברים אינם מושלמים. לא משום שאין עוד לאן
              להתקדם, אלא משום שהתפתחות אמיתית לא נבנית משיפוט מתמיד, אלא מהיכולת
              לראות את עצמנו באופן מלא, עם הכוחות, המגבלות, ההצלחות והטעויות. ומתוך
              המקום הזה, לבחור כיצד להמשיך קדימה.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
