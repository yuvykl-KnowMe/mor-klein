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
    default: "מור קליין | פסיכותרפיה אדלריאנית בזום: קריירה, זוגיות והורות",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W), מלווה בזום בגישה אדלריאנית, בצמתים של קריירה, זוגיות והורות צעירה. שיחת היכרות ראשונה ללא עלות.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "/",
    siteName: SITE_NAME,
    title: "מור קליין | פסיכותרפיה אדלריאנית בזום: קריירה, זוגיות והורות",
    description:
      "מור קליין, פסיכותרפיסטית ועובדת סוציאלית קלינית (M.S.W), מלווה בזום בגישה אדלריאנית, בצמתים של קריירה, זוגיות והורות צעירה.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
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
        {/* Mark JS as available before paint, so reveal animations only hide
            content when JS is present to reveal it (no-JS keeps it visible). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-5 focus:py-3 focus:font-medium focus:text-accent-deep"
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
