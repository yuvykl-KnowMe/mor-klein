import type { MetadataRoute } from "next";
import { POSTS, postPath } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// All indexable routes, built from SITE_URL (non-www, matching metadataBase and
// the canonicals) + the single-source POSTS list, so a new post appears here
// automatically. Static fixed date keeps the output deterministic per build.
const LAST_MODIFIED = "2026-06-18";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/about", "/faq", "/blog", "/privacy", "/terms"];
  const postPaths = POSTS.map((post) => postPath(post.slug));

  return [...staticPaths, ...postPaths].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/blog") ? 0.7 : 0.6,
  }));
}
