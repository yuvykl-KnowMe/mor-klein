import type { Metadata } from "next";
import Link from "next/link";
import { POSTS, postPath } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

const PAGE_TITLE = "מאמרים";
const PAGE_DESCRIPTION =
  "מאמרים קצרים על טיפול נפשי, הגישה האדלריאנית ודפוסים שחוזרים, מאת מור קליין, פסיכותרפיסטית אדלריאנית.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: SITE_NAME,
    url: "/blog",
    title: `${PAGE_TITLE} | ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
  },
};

export default function BlogIndex() {
  return (
    <main id="main" className="flex-1">
      <section aria-labelledby="blog-heading">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
          <h1
            id="blog-heading"
            className="font-heading text-3xl font-extrabold leading-[1.15] sm:text-4xl"
          >
            מאמרים
          </h1>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {POSTS.map((post) => (
              <li key={post.slug}>
                <Link
                  href={postPath(post.slug)}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition duration-500 ease-out hover:border-accent motion-safe:hover:-translate-y-1"
                >
                  <h2 className="font-heading text-xl font-semibold text-ink transition-colors duration-300 ease-out group-hover:text-accent-deep">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-ink-muted">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
