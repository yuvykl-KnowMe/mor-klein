// Single source of truth for site-wide constants.

export const SITE_URL = "https://mor-klein.co.il";
export const SITE_NAME = "מור קליין";
export const EMAIL = "mor@mor-klein.co.il";

// Cal.com booking link — single source of truth. The primary CTAs open this
// as an in-site popup (see components/ui/BookingButton.tsx), not a redirect.
export const BOOKING_URL = "https://cal.com/mor-klein/intro";

// Phone — now public, so people who prefer to just call can reach Mor directly.
// Display form for humans, tel: form for one-tap dialing on mobile.
export const PHONE_DISPLAY = "054-205-4105";
export const PHONE_TEL = "+972542054105";

// Professional titles — copy rule: never use the word "psychologist" in Hebrew.
// Credential abbreviation is M.A.: Mor's Bar-Ilan M.A. in social work
// (rehabilitation & health) is a clinical degree equivalent to an M.S.W, and
// M.A. is the official diploma. Kept consistent everywhere it appears.
export const TITLE_PROFESSION = "פסיכותרפיסטית";
export const TITLE_CREDENTIAL = "עובדת סוציאלית קלינית (M.A.)";

// Primary navigation — single source shared by the header and footer so the
// link set lives in one place. "יצירת קשר" targets the contact section that
// already exists on the home page (id="contact" in components/home/ClosingCta).
export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/about", label: "אודות" },
  { href: "/blog", label: "מאמרים" },
  { href: "/faq", label: "שאלות נפוצות" },
  { href: "/#contact", label: "יצירת קשר" },
];
