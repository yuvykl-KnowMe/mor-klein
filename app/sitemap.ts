import type { MetadataRoute } from "next";
import { getPublishedPosts, postPath } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// Static routes keep a fixed lastModified for deterministic output; blog URLs
// come from the site_posts table so a post Mor publishes in /admin/content
// appears here automatically.
export const revalidate = 300;

const LAST_MODIFIED = "2026-06-18";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["/", "/about", "/faq", "/blog", "/privacy", "/terms"];
  const posts = await getPublishedPosts();

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: (path === "/blog" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.7 : 0.6,
  }));

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}${postPath(post.slug)}`,
    lastModified: post.date_modified ?? post.date_published ?? LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
