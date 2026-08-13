"use client";

import { useState, type FormEvent } from "react";
import { ctaBase, ctaVariants } from "@/components/ui/CtaLink";

// Shared field styling. Inputs sit on the white card, so a faint sand fill
// keeps them visible without heavy borders. Focus ring comes from the global
// :focus-visible rule in globals.css.
const inputCls =
  "w-full rounded-xl border border-line bg-sand/50 px-4 py-3 text-base text-ink";
const labelCls = "mb-2 block font-medium text-ink";
const radioCls = "h-4 w-4 accent-accent-deep";
const radioLabelCls = "inline-flex min-h-11 items-center gap-2 text-ink";

type Status = "idle" | "sending" | "error" | "done";

export function IntakeForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`intake submit failed: ${res.status}`);
      setStatus("done");
    } catch {
      // Keep the form mounted so nothing the client typed is lost.
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-12"
      >
        <p className="font-heading text-2xl font-bold text-ink">
          תודה רבה. אצור איתך קשר ממש בקרוב.
        </p>
        <p className="mt-4 text-lg text-ink-muted">
          השאלון נשלח ונשמר בסודיות מלאה. תודה על הזמן ועל האמון.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-6 sm:p-10"
    >
      <p className="text-sm text-ink-muted">
        שדות המסומנים ב-<span aria-hidden="true">*</span> הם שדות חובה. שאר
        השדות אינם חובה — אפשר למלא רק מה שנוח לך.
      </p>

      <div className="mt-8 flex flex-col gap-7">
        {/* Honeypot: humans never see it; bots that fill it are dropped server-side. */}
        <div className="hidden" aria-hidden="true">
          <label>
            אתר
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div>
          <label htmlFor="full_name" className={labelCls}>
            שם מלא <span aria-hidden="true">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            maxLength={200}
            autoComplete="name"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelCls}>
            נייד <span aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={200}
            autoComplete="tel"
            dir="ltr"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="age" className={labelCls}>
            גיל
          </label>
          <input
            id="age"
            name="age"
            type="text"
            inputMode="numeric"
            maxLength={200}
            className={`${inputCls} sm:max-w-40`}
          />
        </div>

        <fieldset>
          <legend className={labelCls}>מין</legend>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {["אישה", "גבר", "אחר"].map((option) => (
              <label key={option} className={radioLabelCls}>
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  className={radioCls}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="email" className={labelCls}>
            דוא&quot;ל
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={200}
            autoComplete="email"
            dir="ltr"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="occupation" className={labelCls}>
            משלח יד
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            maxLength={200}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="marital_status" className={labelCls}>
            מצב משפחתי
          </label>
          <select
            id="marital_status"
            name="marital_status"
            defaultValue=""
            className={inputCls}
          >
            <option value="">בחר/י...</option>
            {["רווק/ה", "בזוגיות", "נשוי/אה", "גרוש/ה", "אלמן/ה", "אחר"].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ),
            )}
          </select>
        </div>

        <fieldset>
          <legend className={labelCls}>האם אושפזת באשפוז פסיכיאטרי?</legend>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {["כן", "לא"].map((option) => (
              <label key={option} className={radioLabelCls}>
                <input
                  type="radio"
                  name="hospitalization"
                  value={option}
                  className={radioCls}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelCls}>
            האם הינך נוטל/ת תרופות פסיכיאטריות או נטלת בעבר?
          </legend>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {["לא", "בעבר", "כיום"].map((option) => (
              <label key={option} className={radioLabelCls}>
                <input
                  type="radio"
                  name="medication"
                  value={option}
                  className={radioCls}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label
              htmlFor="medication_details"
              className="mb-2 block text-sm text-ink-muted"
            >
              אם כן, אפשר לפרט אילו תרופות (לא חובה)
            </label>
            <input
              id="medication_details"
              name="medication_details"
              type="text"
              maxLength={200}
              className={inputCls}
            />
          </div>
        </fieldset>

        <div>
          <label htmlFor="reason" className={labelCls}>
            אנא כתוב/י בכמה מילים מה מביא אותך לטיפול?
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={5}
            maxLength={5000}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="expectations" className={labelCls}>
            מה הציפיות שלך מהטיפול?
          </label>
          <textarea
            id="expectations"
            name="expectations"
            rows={5}
            maxLength={5000}
            className={inputCls}
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 font-medium text-red-700">
          מצטערת, השליחה לא הצליחה. הפרטים שמילאת נשמרו — אפשר פשוט לנסות לשלוח
          שוב.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`${ctaBase} ${ctaVariants.primary} mt-8 w-full disabled:opacity-60 sm:w-auto sm:px-12`}
      >
        {status === "sending" ? "שולח..." : "שליחת השאלון"}
      </button>
    </form>
  );
}
