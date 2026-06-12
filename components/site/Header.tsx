import Link from "next/link";
import { CtaLink } from "@/components/ui/CtaLink";
import { BOOKING_URL, SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-lg font-bold">
          {SITE_NAME}
        </Link>
        <CtaLink href={BOOKING_URL}>שיחת היכרות</CtaLink>
      </div>
    </header>
  );
}
