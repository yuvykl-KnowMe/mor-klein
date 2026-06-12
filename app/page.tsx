import { Approach } from "@/components/home/Approach";
import { ClosingCta } from "@/components/home/ClosingCta";
import { FocusAreas } from "@/components/home/FocusAreas";
import { Hero } from "@/components/home/Hero";
import { OnlineTherapy } from "@/components/home/OnlineTherapy";
import { Blob, Divider, LineArc } from "@/components/decor/Decor";
import { Reveal } from "@/components/decor/Reveal";
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

      {/* Woven background decoration, drifting gently on scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Blob variant="up" className="-end-16 top-[5%] h-72 w-72" />
        <Blob variant="down" className="-start-20 top-[28%] h-64 w-64" />
        <Blob variant="up" className="-end-24 top-[56%] h-80 w-80" />
        <Blob variant="down" className="-start-16 top-[80%] h-64 w-64" />
        <Reveal aria-hidden className="absolute start-[5%] top-[22%] w-44 rotate-6">
          <LineArc />
        </Reveal>
        <Reveal aria-hidden className="absolute end-[7%] top-[66%] w-40 -rotate-6">
          <LineArc />
        </Reveal>
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
