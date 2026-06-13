import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

const CONTACT_EMAIL = "mork1414@gmail.com";
const CONTACT_PHONE = "054-205-4105";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description:
    "תנאי השימוש באתר של מור קליין: אופי השירות, אחריות, תשלומים וקניין רוחני.",
  alternates: { canonical: "/terms" },
};

const linkClass =
  "text-accent-deep underline underline-offset-4 transition-colors duration-300 ease-out hover:text-accent-deeper";

export default function TermsPage() {
  return (
    <LegalPage title="תנאי שימוש" updated="יוני 2026">
      <LegalSection heading="כללי">
        <p>
          אתר זה מציג מידע אודות שירותי הפסיכותרפיה של מור קליין. השימוש באתר
          מהווה הסכמה לתנאים המפורטים להלן. אם אינכם מסכימים להם, אנא הימנעו
          משימוש באתר.
        </p>
      </LegalSection>

      <LegalSection heading="אופי השירות">
        <p>
          השירות הוא טיפול פסיכותרפי המתקיים אונליין בזום. התכנים באתר הם מידע
          כללי בלבד, ואינם מהווים תחליף לטיפול רפואי, לאבחון או לייעוץ מקצועי
          פרטני.
        </p>
        <p>
          במצב מצוקה או חירום אין להסתמך על האתר. ניתן לפנות לער&quot;ן בטלפון{" "}
          <span dir="ltr">1201</span>, או למוקד החירום של מד&quot;א בטלפון{" "}
          <span dir="ltr">101</span>.
        </p>
      </LegalSection>

      <LegalSection heading="פנייה אינה יוצרת קשר טיפולי">
        <p>
          עצם הגלישה באתר או מילוי טופס אינם יוצרים קשר טיפולי. פנייה דרך האתר
          היא בקשה לתיאום, וההיענות לה נתונה לשיקול דעתה של המטפלת.
        </p>
      </LegalSection>

      <LegalSection heading="קניין רוחני">
        <p>
          כל התכנים באתר, לרבות הטקסטים, העיצוב והלוגו, הם קניינה של מור קליין.
          אין להעתיק, לשכפל או לעשות בהם שימוש מסחרי ללא אישור בכתב.
        </p>
      </LegalSection>

      <LegalSection heading="תשלומים">
        <p>
          תשלום עבור הפגישות מתבצע באמצעות Bit או PayBox, ואישורו נעשה באופן
          ידני. עבור כל תשלום מופקת חשבונית. תנאי ביטול והיעדרות יתואמו מראש
          ישירות מול המטפלת.
        </p>
      </LegalSection>

      <LegalSection heading="הגבלת אחריות">
        <p>
          המידע באתר ניתן כפי שהוא (as-is). איננו אחראים לכל נזק שייגרם
          מהסתמכות על התכנים או מהשימוש באתר.
        </p>
      </LegalSection>

      <LegalSection heading="פרטיות">
        <p>
          השימוש במידע אישי שתמסרו כפוף ל
          <Link href="/privacy" className={linkClass}>
            מדיניות הפרטיות
          </Link>{" "}
          שלנו.
        </p>
      </LegalSection>

      <LegalSection heading="דין וסמכות שיפוט">
        <p>
          על תנאים אלה יחולו דיני מדינת ישראל בלבד, וסמכות השיפוט הבלעדית נתונה
          לבתי המשפט המוסמכים בישראל.
        </p>
      </LegalSection>

      <LegalSection heading="שינויים ויצירת קשר">
        <p>
          אנו רשאים לעדכן תנאים אלה מעת לעת, והגרסה העדכנית תפורסם בעמוד זה. בכל
          שאלה ניתן לפנות בטלפון{" "}
          <a href={`tel:${CONTACT_PHONE}`} className={linkClass} dir="ltr">
            {CONTACT_PHONE}
          </a>{" "}
          או באימייל{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass} dir="ltr">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
