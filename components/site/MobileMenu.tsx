"use client";

import Link from "next/link";
import { useState } from "react";
import { BookingButton } from "@/components/ui/BookingButton";
import { NAV_LINKS } from "@/lib/site";

// Mobile-only nav: a hamburger that toggles a full-width dropdown below the
// header. Client component for the open/close state; closes on link tap so
// client-side navigation never leaves the menu hanging open. One CTA only.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-accent-deep transition-colors duration-300 ease-out hover:bg-surface"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="ניווט ראשי"
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-line bg-surface px-6 py-4 shadow-md"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-3 font-medium text-ink transition-colors duration-300 ease-out hover:bg-sand hover:text-accent-deep"
            >
              {link.label}
            </Link>
          ))}
          <BookingButton className="mt-2 w-full">שיחת היכרות</BookingButton>
        </nav>
      )}
    </div>
  );
}
