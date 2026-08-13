import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postPath, type SitePost } from "@/lib/blog";
import { supabaseAdmin } from "@/lib/supabase";
import { PostForm } from "../post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "עריכת מאמר",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { slug } = await params;
  const { error, saved } = await searchParams;

  // Drafts are editable too, so no published filter here (unlike the public
  // page) — this is why the admin queries site_posts directly.
  const { data } = await supabaseAdmin
    .from("site_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) notFound();
  const post = data as SitePost;

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/content" className="text-sm text-ink-muted">
          &rarr; חזרה לרשימת המאמרים
        </Link>
        <a
          href={postPath(post.slug)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent-deep underline underline-offset-4"
        >
          צפייה במאמר באתר
        </a>
      </div>
      <h1 className="mt-2 truncate font-heading text-2xl font-bold">
        {post.title}
      </h1>
      <PostForm post={post} error={error} saved={saved === "1"} />
    </main>
  );
}
