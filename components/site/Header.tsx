import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/ui/CtaLink";
import { BOOKING_URL, SITE_NAME } from "@/lib/site";
import logo from "@/public/mor-logo-horizontal.png";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex items-center" aria-label={SITE_NAME}>
          <Image
            src={logo}
            alt={SITE_NAME}
            priority
            className="h-15 w-auto sm:h-18"
            sizes="240px"
          />
        </Link>
        <CtaLink href={BOOKING_URL}>שיחת היכרות</CtaLink>
      </div>
    </header>
  );
}
