// Blog posts live in the site_posts table (Supabase) so Mor can edit and
// create them herself from /admin/content. This module is the single read
// path shared by the public blog pages and the sitemap. Server-only (uses the
// service-role client).

import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase";

export type SitePost = {
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  body_md: string;
  published: boolean;
  date_published: string | null; // "YYYY-MM-DD"
  date_modified: string | null; // "YYYY-MM-DD"
  updated_at: string;
};

// Route path for a post. Used for canonical, openGraph url, and index links so
// the path is built in exactly one place.
export function postPath(slug: string): string {
  return `/blog/${slug}`;
}

// cache() dedupes within a single render pass (generateMetadata + the page
// component share one query).
export const getPublishedPosts = cache(async (): Promise<SitePost[]> => {
  const { data, error } = await supabaseAdmin
    .from("site_posts")
    .select("*")
    .eq("published", true)
    .order("date_published", { ascending: false })
    .order("slug");
  if (error) throw new Error(`site_posts query failed: ${error.message}`);
  return (data ?? []) as SitePost[];
});

export const getPublishedPost = cache(
  async (slug: string): Promise<SitePost | null> => {
    const { data, error } = await supabaseAdmin
      .from("site_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(`site_posts query failed: ${error.message}`);
    return (data as SitePost | null) ?? null;
  }
);
