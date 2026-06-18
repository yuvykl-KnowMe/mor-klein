import type { Metadata } from "next";
import { getPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const post = getPost("what-is-therapy");

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: postPath(post.slug) },
  openGraph: {
    type: "article",
    locale: "he_IL",
    siteName: SITE_NAME,
    url: postPath(post.slug),
    title: post.title,
    description: post.description,
  },
};

// Article structured data. URLs stay non-www to match SITE_URL / metadataBase.
// Dates reflect creation; bump dateModified when the body content lands.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  inLanguage: "he",
  author: { "@type": "Person", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}${postPath(post.slug)}`,
  },
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
};

export default function Post() {
  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
        <h1 className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl">
          {post.title}
        </h1>
        {/* CONTENT WILL BE ADDED IN NEXT STEP */}
      </article>
    </main>
  );
}
