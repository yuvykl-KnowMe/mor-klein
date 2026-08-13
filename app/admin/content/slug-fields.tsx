"use client";

// Title + slug inputs for a NEW post: typing a title auto-suggests a Latin
// slug until the slug field is edited by hand.

import { useState } from "react";

const inputClass = "mt-1 w-full rounded-lg border border-line bg-surface p-3";

// ponytail: naive letter-by-letter Hebrew transliteration — good enough for a
// slug suggestion Mor can always edit; swap for a real library if ever needed.
const HE_TO_LATIN: Record<string, string> = {
  א: "a", ב: "b", ג: "g", ד: "d", ה: "h", ו: "o", ז: "z", ח: "ch",
  ט: "t", י: "i", כ: "k", ך: "k", ל: "l", מ: "m", ם: "m", נ: "n",
  ן: "n", ס: "s", ע: "a", פ: "p", ף: "f", צ: "tz", ץ: "tz", ק: "k",
  ר: "r", ש: "sh", ת: "t",
};

function suggestSlug(title: string): string {
  return title
    .toLowerCase()
    .split("")
    .map((ch) => HE_TO_LATIN[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

export function SlugFields() {
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  return (
    <>
      <label className="block">
        <span className="text-sm font-semibold">כותרת</span>
        <input
          name="title"
          required
          className={inputClass}
          onChange={(e) => {
            if (!slugEdited) setSlug(suggestSlug(e.target.value));
          }}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">כתובת המאמר (באנגלית)</span>
        <input
          name="slug"
          required
          dir="ltr"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="אותיות אנגליות קטנות, ספרות ומקפים בלבד"
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-ink-muted">
          זו תהיה הכתובת הקבועה של המאמר (למשל /blog/my-article) — אי אפשר
          לשנות אותה אחרי היצירה.
        </span>
      </label>
    </>
  );
}
