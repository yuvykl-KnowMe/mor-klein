import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPublishedPost, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// ISR: pages regenerate at most every 5 minutes; saving in /admin/content
// also calls revalidatePath so edits appear immediately.
export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description ?? undefined,
    alternates: { canonical: postPath(post.slug) },
    openGraph: {
      type: "article",
      locale: "he_IL",
      siteName: SITE_NAME,
      url: postPath(post.slug),
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description ?? undefined,
    },
  };
}

// ---- Tiny markdown renderer (the whole dialect) ----------------------------
// Blank-line-separated paragraphs; "## " -> H2 section; [text](url) -> styled
// in-prose link; "> " -> bordered pull quote. Everything else is plain text.

// In-prose link pattern, matching /about and the home contact links.
const proseLink =
  "text-accent-deep underline underline-offset-4 transition-colors duration-300 ease-out hover:text-accent-deeper";
const sectionHeading =
  "font-heading text-2xl font-bold leading-[1.3] sm:text-3xl";
const proseBody = "mt-6 flex flex-col gap-4 text-lg text-ink-muted";
const pullQuote = "border-s-4 border-accent ps-5";

type Block = { kind: "p" | "quote"; text: string };
type Section = { heading: string | null; body: Block[] };

function parseSections(md: string): Section[] {
  const sections: Section[] = [{ heading: null, body: [] }];
  for (const raw of md.split(/\n\s*\n/)) {
    const block = raw.trim();
    if (!block) continue;
    if (block.startsWith("## ")) {
      sections.push({ heading: block.slice(3).trim(), body: [] });
    } else if (block.startsWith("> ")) {
      const text = block
        .split("\n")
        .map((line) => line.replace(/^>\s?/, ""))
        .join(" ")
        .trim();
      sections[sections.length - 1].body.push({ kind: "quote", text });
    } else {
      sections[sections.length - 1].body.push({
        kind: "p",
        text: block.replace(/\n+/g, " "),
      });
    }
  }
  return sections.filter((s) => s.heading !== null || s.body.length > 0);
}

// [text](url) -> <Link>; everything around it stays a plain text node.
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/\[([^\]]+)\]\(([^)\s]+)\)/g);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) nodes.push(parts[i]);
    if (parts[i + 1] !== undefined) {
      nodes.push(
        <Link key={i} href={parts[i + 2]} className={proseLink}>
          {parts[i + 1]}
        </Link>
      );
    }
  }
  return nodes;
}

function renderBlock(block: Block, key: number) {
  return block.kind === "quote" ? (
    <blockquote key={key} className={pullQuote}>
      {renderInline(block.text)}
    </blockquote>
  ) : (
    <p key={key}>{renderInline(block.text)}</p>
  );
}

// ----------------------------------------------------------------------------

export default async function Post({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  // Article structured data. URLs stay non-www to match SITE_URL /
  // metadataBase. Dates come from the site_posts row.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
        datePublished: post.date_published,
        dateModified: post.date_modified,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "בית", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "מאמרים",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${SITE_URL}${postPath(post.slug)}`,
          },
        ],
      },
    ],
  };

  const sections = parseSections(post.body_md);

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

        {sections.map((section, i) =>
          section.heading === null ? (
            <div key={i} className={proseBody}>
              {section.body.map(renderBlock)}
            </div>
          ) : (
            <section key={i} className="mt-12">
              <h2 className={sectionHeading}>{section.heading}</h2>
              <div className={proseBody}>{section.body.map(renderBlock)}</div>
            </section>
          )
        )}
      </article>
    </main>
  );
}
