import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/site/MobileMenu";
import { BookingButton } from "@/components/ui/BookingButton";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";
import logo from "@/public/mor-logo-horizontal.png";

// `relative` so MobileMenu's dropdown can anchor to the header; `z-40` keeps it
// above page content when open.
export function Header() {
  return (
    <header className="relative z-40 border-b border-line bg-sand">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="inline-flex items-center" aria-label={SITE_NAME}>
          <Image
            src={logo}
            alt={SITE_NAME}
            priority
            className="h-15 w-auto sm:h-18"
            sizes="240px"
          />
        </Link>

        {/* Desktop nav: links + one CTA. Hidden on mobile (see MobileMenu). */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="ניווט ראשי">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center font-medium text-ink-muted transition-colors duration-300 ease-out hover:text-accent-deep"
            >
              {link.label}
            </Link>
          ))}
          <BookingButton>שיחת היכרות</BookingButton>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
