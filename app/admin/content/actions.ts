"use server";

// Server actions for the blog editor (/admin/content). Auth is enforced by
// proxy.ts (cookie session) for everything under /admin.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { postPath } from "@/lib/blog";
import { supabaseAdmin } from "@/lib/supabase";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Revalidate every page a post appears on so a save shows up immediately.
function revalidatePost(slug: string) {
  revalidatePath("/blog");
  revalidatePath(postPath(slug));
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/content");
}

export async function savePost(formData: FormData) {
  const isNew = formData.get("is_new") === "1";
  const originalSlug = String(formData.get("original_slug") ?? "");
  // Slug is immutable after creation: updates always target the original.
  const slug = isNew
    ? String(formData.get("slug") ?? "").trim().toLowerCase()
    : originalSlug;
  const back = isNew
    ? "/admin/content/new"
    : `/admin/content/${encodeURIComponent(originalSlug)}`;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect(`${back}?error=title`);
  if (isNew && !SLUG_RE.test(slug)) redirect(`${back}?error=slug`);

  const row = {
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body_md: String(formData.get("body_md") ?? "").replace(/\r\n/g, "\n"),
    published: formData.get("published") === "on",
    date_published: String(formData.get("date_published") ?? "") || null,
    date_modified: String(formData.get("date_modified") ?? "") || null,
    updated_at: new Date().toISOString(),
  };

  if (isNew) {
    const { error } = await supabaseAdmin
      .from("site_posts")
      .insert({ slug, ...row });
    if (error) {
      // 23505 = unique_violation (slug already taken).
      redirect(`${back}?error=${error.code === "23505" ? "exists" : "db"}`);
    }
  } else {
    const { error } = await supabaseAdmin
      .from("site_posts")
      .update(row)
      .eq("slug", slug);
    if (error) redirect(`${back}?error=db`);
  }

  revalidatePost(slug);
  redirect(`/admin/content/${encodeURIComponent(slug)}?saved=1`);
}

export async function togglePublished(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const publish = formData.get("publish") === "1";
  await supabaseAdmin
    .from("site_posts")
    .update({ published: publish, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  revalidatePost(slug);
}
