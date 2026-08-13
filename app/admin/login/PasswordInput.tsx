"use client";

import { useState } from "react";

export function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name="password"
        required
        autoComplete="current-password"
        dir="ltr"
        className="min-h-11 w-full rounded-xl border border-line bg-surface pl-3 pr-16 text-base"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-2 my-auto flex h-8 items-center rounded px-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        {show ? "הסתרה" : "הצגה"}
      </button>
    </div>
  );
}
