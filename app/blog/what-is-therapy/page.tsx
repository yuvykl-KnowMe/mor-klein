import type { Metadata } from "next";
import Link from "next/link";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("what-is-therapy");

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: postPath(post.slug) },
  openGraph: {
    type: "article",
    locale: "he_IL",
    siteName: SITE_NAME,
    url: postPath(post.slug),
    title: post.title,
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
            ההחלטה לפנות לטיפול היא לא תמיד פשוטה. לפעמים אנחנו יודעים בדיוק מה
            מביא אותנו לשם, משבר, פרידה, חרדה או קושי בזוגיות. אבל פעמים רבות
            הסיבה פחות ברורה. יש תחושה שמשהו לא עובד כמו שהיינו רוצים, שאנחנו
            תקועים, מבולבלים או פשוט לא מרוצים מהאופן שבו אנחנו חיים את חיינו.
          </p>
          <p>
            לצד ההתלבטות עולות לא פעם גם שאלות: מה בכלל עושים בטיפול? על מה מדברים?
            מה מצופה ממני? והאם זה באמת יכול לעזור? אם גם אתם שאלתם את עצמכם את
            השאלות האלה, אתם לא לבד.
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading}>
            מה ההבדל בין שיחה עם חבר לשיחה עם מטפל?
          </h2>
          <div className={proseBody}>
            <p>
              חברים טובים הם משאב חשוב ומשמעותי בחיים שלנו. הם מקשיבים, תומכים,
              מעודדים ולעיתים גם נותנים עצה טובה. אבל טיפול הוא משהו אחר.
            </p>
            <p>
              בניגוד לחבר, המטפל אינו חלק ממעגל החיים שלכם. הוא לא צד בסיפור, לא
              מושפע מההחלטות שלכם ולא זקוק מכם לדבר. דווקא המרחק הזה מאפשר התבוננות
              אחרת.
            </p>
            <p>
              בטיפול יש מקום לעצור ולהבין לעומק מה קורה לכם, לא רק מה קרה השבוע,
              אלא אילו דפוסים חוזרים על עצמם, אילו אמונות מנהלות אתכם, ואיך כל אלה
              משפיעים על הבחירות, הרגשות ומערכות היחסים שלכם. המטרה אינה רק לפרוק
              או לקבל עצה, אלא לפתח הבנה עמוקה יותר של עצמכם ושל האפשרויות שעומדות
              בפניכם.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>מה קורה בפגישה הראשונה?</h2>
          <div className={proseBody}>
            <p>
              אחת השאלות הנפוצות ביותר היא: &quot;מה אני אמור להגיד בפגישה
              הראשונה?&quot; התשובה הפשוטה היא שאין דבר כזה &quot;אמור&quot;.
              הפגישה הראשונה היא הזדמנות להכיר.
            </p>
            <p>
              אני בדרך כלל אשאל שאלות על הסיבה שבגללה פניתם, על תחומי החיים השונים
              שלכם ועל הדברים שמעסיקים אתכם כיום. לא מדובר בחקירה או במבחן, אלא
              בניסיון להבין אתכם ואת העולם שממנו אתם מגיעים.
            </p>
            <p>
              חשוב לדעת שלא חייבים להגיע עם סיפור מסודר או עם תשובות לכל השאלות.
              לפעמים אנשים מגיעים עם תחושת בלבול, תקיעות או חוסר שקט שקשה להם
              להסביר. גם זה מקום מצוין להתחיל ממנו.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>האם צריך להגיע רק כשיש משבר?</h2>
          <div className={proseBody}>
            <p>
              ממש לא. אנשים פונים לטיפול מסיבות רבות ומגוונות. לפעמים מדובר במשבר
              חיים משמעותי, אבל פעמים רבות מדובר ברצון להבין את עצמם טוב יותר,
              לשפר מערכות יחסים, להתמודד עם קושי בקבלת החלטות, לחזק את הביטחון
              העצמי או למצוא כיוון ומשמעות. לא צריך לחכות שהמצב יהיה בלתי נסבל כדי
              לפנות לעזרה.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>האם המטפל יגיד לי מה לעשות?</h2>
          <div className={proseBody}>
            <p>
              זו שאלה שאנשים רבים שואלים, גם אם לא תמיד בקול רם. התפקיד שלי כמטפלת
              אינו לקבל החלטות במקומכם או להגיד לכם איך לחיות את חייכם. אני מאמינה
              שאתם המומחים לחיים שלכם.
            </p>
            <p>
              התפקיד שלי הוא לעזור לכם להתבונן על עצמכם ועל הסיטואציה מזוויות
              חדשות, לזהות דפוסים שחוזרים על עצמם, להבין מה מניע אתכם ולגלות
              אפשרויות שלא תמיד היו גלויות לכם קודם. מתוך התהליך הזה, הבחירות
              הופכות בדרך כלל לבהירות ומדויקות יותר.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>כמה זמן לוקח לראות שינוי?</h2>
          <div className={proseBody}>
            <p>
              אין תשובה אחת שמתאימה לכולם. כל אדם מגיע עם סיפור חיים שונה, מטרות
              שונות וקצב אישי משלו. יש אנשים שמרגישים הקלה כבר לאחר מספר פגישות,
              ויש תהליכים שמצריכים זמן רב יותר.
            </p>
            <p>
              עם זאת, שינוי לא תמיד נראה כפי שאנחנו מדמיינים. פעמים רבות הסימנים
              הראשונים לכך שטיפול מתחיל לעבוד הם דווקא עדינים: הבנה חדשה, תגובה
              שונה במצב מוכר, יכולת טובה יותר להציב גבולות או תחושה שיש יותר
              אפשרויות בחירה ממה שחשבנו. הצעדים הקטנים האלה הם לעיתים תחילתו של
              שינוי משמעותי ועמוק.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>שאלות שאנשים לפעמים חוששים לשאול</h2>
          <div className={proseBody}>
            <p>
              יש שאלות שעולות אצל רבים, גם אם לא תמיד נאמרות בקול. מה אם לא אדע על
              מה לדבר? זה קורה להרבה אנשים, במיוחד בהתחלה, וגם שתיקה או חוסר ידיעה
              יכולים להפוך לנושא משמעותי בפני עצמו. מה אם אתבייש לספר דברים מסוימים?
              אחד הדברים החשובים בטיפול הוא יצירת מרחב שבו אפשר לדבר גם על החלקים
              שאנחנו נוטים להסתיר, מתוך קבלה והבנה. ומה אם אגלה שזה לא מתאים לי?
              הקשר הטיפולי הוא מרכיב משמעותי בתהליך, וחלק מהעבודה הוא לבדוק יחד אם
              הטיפול והמטפל מתאימים לצרכים שלכם.
            </p>
            <p>
              ריכזתי{" "}
              <Link href="/faq" className={proseLink}>
                שאלות נפוצות נוספות
              </Link>{" "}
              על טיפול, סודיות, אונליין ועלויות בעמוד נפרד.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>אז למה טיפול עובד?</h2>
          <div className={proseBody}>
            <p>
              בעיניי, טיפול עובד משום שהוא מאפשר לנו לעצור ולהתבונן בעצמנו באופן
              שלא מתאפשר בדרך כלל בתוך שגרת החיים. הוא מעניק מרחב להבין את הסיפור
              שלנו, לזהות את הדפוסים שמלווים אותנו, להתחבר לכוחות שלנו ולבחון דרכים
              חדשות להתמודד עם האתגרים שאנחנו פוגשים.
            </p>
            <p>
              אבל יותר מכל, טיפול יוצר הזדמנות לתנועה. לא רק להבין למה אנחנו כפי
              שאנחנו, אלא גם לבחור כיצד אנחנו רוצים להמשיך מכאן. כי לפעמים שינוי
              מתחיל לא ברגע שבו יש לנו את כל התשובות, אלא ברגע שבו אנחנו מסכימים
              לשאול את השאלות.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
