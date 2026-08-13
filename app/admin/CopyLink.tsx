"use client";

import { useState } from "react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4">
      <span className="text-sm font-bold">קישור לשאלון למטופלים חדשים:</span>
      <code dir="ltr" className="text-sm text-ink-muted">
        {url}
      </code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="min-h-9 rounded-full bg-accent-deep px-4 text-sm font-bold text-on-accent transition-colors hover:bg-accent-deeper"
      >
        {copied ? "הועתק ✓" : "העתקה"}
      </button>
    </div>
  );
}
