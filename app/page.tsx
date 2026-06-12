import { Approach } from "@/components/home/Approach";
import { ClosingCta } from "@/components/home/ClosingCta";
import { FocusAreas } from "@/components/home/FocusAreas";
import { Hero } from "@/components/home/Hero";
import { OnlineTherapy } from "@/components/home/OnlineTherapy";
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
        "פסיכותרפיה אדלריאנית אונליין בזום, ליווי בצמתים של קריירה, זוגיות והורות צעירה.",
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
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FocusAreas />
      <Approach />
      <OnlineTherapy />
      <ClosingCta />
    </main>
  );
}
