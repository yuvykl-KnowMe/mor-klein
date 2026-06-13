import { Approach } from "@/components/home/Approach";
import { ClosingCta } from "@/components/home/ClosingCta";
import { FocusAreas } from "@/components/home/FocusAreas";
import { Hero } from "@/components/home/Hero";
import { OnlineTherapy } from "@/components/home/OnlineTherapy";
import { Blob, Divider, Float, LineArc } from "@/components/decor/Decor";
import { Branch, Dots, Leaf, Scribble, Swirl } from "@/components/decor/WabiSabi";
import {
  EMAIL,
  SITE_NAME,
  SITE_URL,
  TITLE_CREDENTIAL,
  TITLE_PROFESSION,
} from "@/lib/site";

// Only true, confirmed facts. No address, phone, hours, prices or ratings.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#practice`,
      name: `${SITE_NAME}, פסיכותרפיה`,
      url: SITE_URL,
      email: EMAIL,
      description:
        "פסיכותרפיה אדלריאנית בזום, ליווי בצמתים של קריירה, זוגיות והורות צעירה.",
      serviceType: [
        "פסיכותרפיה",
        "ליווי זוגי",
        "ליווי בהורות צעירה",
        "ליווי בהתלבטויות קריירה",
      ],
      areaServed: { "@type": "Country", name: "IL" },
      availableLanguage: "he",
      founder: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      jobTitle: TITLE_PROFESSION,
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: TITLE_CREDENTIAL,
      },
      knowsAbout: ["פסיכותרפיה אדלריאנית"],
      worksFor: { "@id": `${SITE_URL}/#practice` },
      url: SITE_URL,
      email: EMAIL,
    },
  ],
};

export default function Home() {
  return (
    <main id="main" className="relative isolate flex-1 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Woven background decoration: soft gold blobs + delicate slate line
          motifs, fading in and drifting gently on scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Blob variant="up" className="-end-16 top-[5%] h-72 w-72" />
        <Blob variant="down" className="-start-20 top-[28%] h-64 w-64" />
        <Blob variant="up" className="-end-24 top-[56%] h-80 w-80" />
        <Blob variant="down" className="-start-16 top-[80%] h-64 w-64" />

        <Float className="start-[3%] top-[7%] w-24 opacity-50" drift="drift-soft-down">
          <Leaf className="-rotate-6" />
        </Float>
        <Float className="end-[4%] top-[11%] w-28 opacity-45" drift="drift-soft-up">
          <Branch />
        </Float>
        <Float className="start-[13%] top-[19%] w-10 opacity-60">
          <Dots />
        </Float>
        <Float className="start-[6%] top-[40%] w-44 opacity-40" drift="drift-soft-up">
          <LineArc className="rotate-3" />
        </Float>
        <Float className="end-[5%] top-[45%] w-40 opacity-45" drift="drift-soft-down">
          <Swirl />
        </Float>
        <Float className="end-[12%] top-[62%] w-9 opacity-55">
          <Dots />
        </Float>
        <Float className="start-[5%] top-[72%] w-28 opacity-40" drift="drift-soft-up">
          <Scribble className="rotate-6" />
        </Float>
        <Float className="end-[6%] top-[88%] w-24 opacity-40" drift="drift-soft-down">
          <Branch className="-scale-x-100" />
        </Float>
      </div>

      <Hero />
      <Divider />
      <FocusAreas />
      <Divider />
      <Approach />
      <Divider />
      <OnlineTherapy />
      <Divider />
      <ClosingCta />
    </main>
  );
}
