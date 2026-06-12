import type { Metadata, Viewport } from "next";
import { Assistant, Heebo } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
});

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "מור קליין | פסיכותרפיה אדלריאנית אונליין: קריירה, זוגיות והורות",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W), מלווה אונליין בזום בגישה אדלריאנית, בצמתים של קריירה, זוגיות והורות צעירה. שיחת היכרות ראשונה ללא עלות.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "/",
    siteName: SITE_NAME,
    title: "מור קליין | פסיכותרפיה אדלריאנית אונליין: קריירה, זוגיות והורות",
    description:
      "מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W), מלווה אונליין בזום בגישה אדלריאנית, בצמתים של קריירה, זוגיות והורות צעירה.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${assistant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-5 focus:py-3 focus:font-medium focus:text-sage-deep"
        >
          דילוג לתוכן הראשי
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
