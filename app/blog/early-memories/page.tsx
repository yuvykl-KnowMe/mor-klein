import type { Metadata } from "next";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("early-memories");

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
      datePublished: "2026-08-04",
      dateModified: "2026-08-04",
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
            זו שאלה שלעיתים מפתיעה מטופלים בתחילת התהליך. לא מעט אנשים תוהים אם
            באמת יש משמעות לזיכרון בודד מגיל ארבע או חמש, והאם הוא בכלל
            &quot;חשוב מספיק&quot;.
          </p>
          <p>
            בגישה האדלריאנית, התשובה היא שכן – אבל לא מהסיבה שרבים חושבים.
          </p>
          <p>
            המטרה אינה לבדוק אם הזיכרון מדויק מבחינה היסטורית, אלא להבין{" "}
            <em>מדוע דווקא הזיכרון הזה נשמר</em> מתוך אינספור חוויות הילדות.
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading}>למה דווקא זיכרונות מוקדמים?</h2>
          <div className={proseBody}>
            <p>
              אלפרד אדלר האמין שהזיכרונות המוקדמים שאנו נושאים איתנו משקפים את
              הדרך שבה למדנו להבין את עצמנו, את האחרים ואת העולם. הם אינם
              &quot;הסיבה&quot; לקשיים שלנו, אלא מעין חלון אל האופן שבו אנו
              מפרשים את המציאות. דרך הזיכרונות ניתן לזהות אמונות, רגשות ודפוסים
              שממשיכים ללוות אותנו גם שנים רבות לאחר מכן.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>איך זה מחבר בין העבר להווה?</h2>
          <div className={proseBody}>
            <p>
              לעיתים אדם מספר זיכרון שבו הרגיש שהוא צריך להסתדר לבד, שלא ראו
              אותו או שהיה עליו להיות &quot;הילד הטוב&quot;. בטיפול איננו נשארים
              רק בעבר- אנחנו שואלים כיצד החוויה הזאת ממשיכה לבוא לידי ביטוי
              כיום. האם גם היום קשה לבקש עזרה? האם חשוב תמיד לרצות את כולם? האם
              יש חשש לטעות או לאכזב?
            </p>
            <p>
              העבר אינו מכתיב את חיינו, אך הוא בהחלט משפיע על האופן שבו למדנו
              להתבונן בעולם. כשאנחנו מבינים את הקשר בין חוויות מוקדמות לבין
              ההתנהלות שלנו כיום, נפתחת האפשרות לבחור בדרכים חדשות.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>אז מה המטרה של העבודה עם זיכרונות?</h2>
          <div className={proseBody}>
            <p>
              המטרה אינה &quot;לחפור בעבר&quot;, אלא להשתמש בו כדי להבין טוב
              יותר את ההווה. הזיכרונות מסייעים לנו לזהות דפוסים, להבין את
              המשמעות שאנחנו מעניקים לאירועים בחיינו ולהכיר את הדרך שבה עיצבנו
              את תפיסת העולם שלנו. מתוך ההבנה הזו אפשר להתחיל לבחון האם אותם
              דפוסים עדיין משרתים אותנו, או שהגיע הזמן ליצור אפשרויות חדשות.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={sectionHeading}>מבט לעבר כדי לבחור את העתיד</h2>
          <div className={proseBody}>
            <p>
              אחד הדברים שאני אוהבת במיוחד בגישה האדלריאנית הוא האיזון שהיא יוצרת
              בין העבר, ההווה והעתיד. אנחנו מתבוננים בעבר מתוך סקרנות ולא מתוך
              האשמה. אנחנו מבינים כיצד התעצבו הדפוסים שלנו, אך לא נשארים שם.
              המטרה היא להשתמש בהבנה הזאת כדי לחיות את ההווה בצורה שונה.
            </p>
            <p>
              בסופו של דבר, זיכרון מוקדם אינו רק סיפור מהילדות. הוא חלון אל האופן
              שבו אנחנו מפרשים את עצמנו ואת הסביבה שלנו. וממנו, לפעמים, אפשר לצאת
              עם הבנה שלא הייתה שם קודם.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
