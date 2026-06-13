import { Approach } from "@/components/home/Approach";
import { ClosingCta } from "@/components/home/ClosingCta";
import { FocusAreas } from "@/components/home/FocusAreas";
import { Hero } from "@/components/home/Hero";
import { OnlineTherapy } from "@/components/home/OnlineTherapy";
import { Blob, Divider, Float, LineArc } from "@/components/decor/Decor";
import { Reveal } from "@/components/decor/Reveal";
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
          motifs, fading in and drifting gently on scroll (JS parallax) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Float className="-end-16 top-[5%] h-72 w-72" speed={0.16} reveal={false}>
          <Blob />
        </Float>
        <Float className="-start-20 top-[28%] h-64 w-64" speed={-0.14} reveal={false}>
          <Blob />
        </Float>
        <Float className="-end-24 top-[56%] h-80 w-80" speed={0.2} reveal={false}>
          <Blob />
        </Float>
        <Float className="-start-16 top-[80%] h-64 w-64" speed={-0.18} reveal={false}>
          <Blob />
        </Float>

        <Float className="start-[3%] top-[7%] w-24 opacity-50" speed={-0.38}>
          <Leaf className="-rotate-6" />
        </Float>
        <Float className="end-[4%] top-[11%] w-28 opacity-45" speed={0.34}>
          <Branch />
        </Float>
        <Float className="start-[13%] top-[19%] w-10 opacity-60" speed={0.3}>
          <Dots />
        </Float>
        <Float className="start-[6%] top-[40%] w-44 opacity-40" speed={-0.3}>
          <LineArc className="rotate-3" />
        </Float>
        <Float className="end-[5%] top-[45%] w-40 opacity-45" speed={0.42}>
          <Swirl />
        </Float>
        <Float className="end-[12%] top-[62%] w-9 opacity-55" speed={-0.36}>
          <Dots />
        </Float>
        <Float className="start-[5%] top-[72%] w-28 opacity-40" speed={0.4}>
          <Scribble className="rotate-6" />
        </Float>
        <Float className="end-[6%] top-[88%] w-24 opacity-40" speed={-0.34}>
          <Branch className="-scale-x-100" />
        </Float>
      </div>

      <Reveal>
        <Hero />
      </Reveal>
      <Divider />
      <Reveal>
        <FocusAreas />
      </Reveal>
      <Divider />
      <Reveal>
        <Approach />
      </Reveal>
      <Divider />
      <Reveal>
        <OnlineTherapy />
      </Reveal>
      <Divider />
      <Reveal>
        <ClosingCta />
      </Reveal>
    </main>
  );
}
