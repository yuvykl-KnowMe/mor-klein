import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

const CONTACT_EMAIL = "mork1414@gmail.com";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description:
    "מדיניות הפרטיות של מור קליין: איזה מידע נאסף, כיצד הוא נשמר ומשמש, והזכויות שלכם לפי חוק הגנת הפרטיות, התשמ\"א-1981, כולל תיקון 13.",
  alternates: { canonical: "/privacy" },
};

const linkClass =
  "text-accent-deep underline underline-offset-4 transition-colors duration-300 ease-out hover:text-accent-deeper";

// Each processor is named for informed-consent transparency (skill: disclose
// processors, incl. cross-border ones).
const processors: { name: string; role: string }[] = [
  { name: "Supabase", role: "אחסון המידע; השרתים ממוקמים באיחוד האירופי" },
  { name: "Resend", role: "שליחת הודעות אימייל" },
  { name: "Cal.com", role: "תיאום פגישות" },
  { name: "Zoom", role: "קיום הפגישות בווידאו" },
  { name: "Morning", role: "הפקת חשבוניות; ספק ישראלי" },
];

export default function PrivacyPage() {
  return (
    <LegalPage title="מדיניות פרטיות" updated="יוני 2026">
      <LegalSection heading="מי אנחנו">
        <p>
          אתר זה מופעל על ידי מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית
          (M.S.W), עוסק מורשה 303018931, המקיימת טיפול אונליין בזום בלבד. אנו
          מתייחסים לפרטיות שלכם ברצינות, במיוחד משום שמדובר לעיתים במידע אישי
          ורגיש. מדיניות זו מסבירה איזה מידע נאסף וכיצד הוא מטופל, בהתאם לחוק
          הגנת הפרטיות, התשמ&quot;א-1981, כולל תיקון 13.
        </p>
      </LegalSection>

      <LegalSection heading="איזה מידע נאסף">
        <p>
          בטופס יצירת הקשר נאספים השם, מספר הטלפון וכתובת האימייל שתמסרו, כדי
          שנוכל לחזור אליכם.
        </p>
        <p>
          אם תבחרו להתחיל תהליך טיפולי, טופס הקליטה עשוי לכלול מידע רגיש על
          מצבכם הנפשי והרגשי. מידע זה נמסר מרצונכם ובהסכמתכם, ומשמש אך ורק לצורך
          התהליך הטיפולי.
        </p>
      </LegalSection>

      <LegalSection heading="למה המידע משמש">
        <p>
          המידע משמש למענה לפנייתכם, לתיאום ולקיום הפגישות, ולהפקת חשבוניות
          כנדרש על פי דין. איננו עושים בו כל שימוש אחר, ואיננו מוכרים אותו לאף
          גורם.
        </p>
      </LegalSection>

      <LegalSection heading="שיתוף מידע והעברתו">
        <p>
          לצורך הפעלת השירות אנו נעזרים בספקי תשתית מהימנים, שכל אחד מהם נחשף רק
          למידע הנחוץ לתפקידו:
        </p>
        <ul className="list-disc space-y-1 ps-5">
          {processors.map((p) => (
            <li key={p.name}>
              <span dir="ltr">{p.name}</span> — {p.role}
            </li>
          ))}
        </ul>
        <p>
          חלק מהספקים מעבדים מידע מחוץ לישראל, לרבות בארצות הברית. העברה זו
          נעשית בהסכמתכם ובכפוף להתחייבויות חוזיות לשמירה על המידע. העברת מידע
          אל מדינות האיחוד האירופי אינה מצריכה אמצעים נוספים, שכן האיחוד מוכר
          כבעל רמת הגנה נאותה על מידע.
        </p>
      </LegalSection>

      <LegalSection heading="אבטחת מידע">
        <p>
          אנו נוקטים אמצעים טכניים וארגוניים סבירים כדי להגן על המידע, לרבות
          הצפנה והגבלת הגישה. הגישה למידע הרגיש שמורה למטפלת בלבד.
        </p>
      </LegalSection>

      <LegalSection heading="שמירת מידע">
        <p>
          המידע נשמר למשך הזמן הנדרש לקיום הקשר הטיפולי וכנדרש על פי דין, ולאחר
          מכן נמחק או הופך לאנונימי.
        </p>
      </LegalSection>

      <LegalSection heading="הזכויות שלכם">
        <p>
          על פי חוק הגנת הפרטיות עומדת לכם הזכות לעיין במידע השמור אודותיכם
          (סעיף 13), לבקש לתקנו (סעיף 14), ולחזור בכם מהסכמתכם בכל עת. נשיב לכל
          פנייה בתוך 30 יום. לכל בקשה או שאלה בנושא פרטיות ניתן לפנות לכתובת{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass} dir="ltr">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="קטינים">
        <p>
          השירות אינו מיועד לקטינים מתחת לגיל 18 ללא הסכמת הורה או אפוטרופוס.
          איסוף מידע על קטין ייעשה רק לאחר קבלת הסכמה כזו.
        </p>
      </LegalSection>

      <LegalSection heading="אירוע אבטחת מידע">
        <p>
          במקרה של אירוע המסכן את המידע, נפעל בהתאם לחוק: נדווח לרשות להגנת
          הפרטיות בתוך 72 שעות, ונודיע לנפגעים ללא דיחוי כאשר קיים סיכון גבוה
          לזכויותיהם.
        </p>
      </LegalSection>

      <LegalSection heading="אין עוגיות ומעקב">
        <p>
          האתר אינו עושה שימוש בעוגיות מעקב, בכלי אנליטיקה או בכלי פרסום. איננו
          עוקבים אחר הגלישה שלכם.
        </p>
      </LegalSection>

      <LegalSection heading="שינויים במדיניות">
        <p>
          אנו רשאים לעדכן מדיניות זו מעת לעת. הגרסה העדכנית תפורסם תמיד בעמוד
          זה, לצד תאריך העדכון האחרון.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
