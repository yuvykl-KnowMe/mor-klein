import type { Metadata } from "next";
import Link from "next/link";
import { postPath, type SitePost } from "@/lib/blog";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate } from "../helpers";
import { togglePublished } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ניהול מאמרים",
  robots: { index: false, follow: false },
};

type Row = Pick<SitePost, "slug" | "title" | "published" | "updated_at">;

export default async function ContentAdminPage() {
  const { data, error } = await supabaseAdmin
    .from("site_posts")
    .select("slug, title, published, updated_at")
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as Row[];

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">מאמרים באתר</h1>
        <Link
          href="/admin/content/new"
          className="rounded-lg bg-accent-deep px-4 py-2 text-on-accent hover:bg-accent-deeper"
        >
          מאמר חדש
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-5 text-ink-muted">
          לא הצלחנו לטעון את המאמרים כרגע. אפשר לנסות לרענן את הדף בעוד רגע.
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-5 text-ink-muted">
          אין עדיין מאמרים. לחצי על ״מאמר חדש״ כדי לכתוב את הראשון.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex items-center justify-between gap-3 p-4"
            >
              <Link
                href={`/admin/content/${post.slug}`}
                className="min-w-0 flex-1 hover:opacity-80"
              >
                <span className="block truncate font-semibold">
                  {post.title}
                </span>
                <span className="block text-sm text-ink-muted" dir="ltr">
                  {postPath(post.slug)}
                </span>
                <span className="block text-sm text-ink-muted">
                  עודכן: {formatDate(post.updated_at)}
                </span>
              </Link>
              {/* Tapping the status badge toggles published/draft. */}
              <form action={togglePublished}>
                <input type="hidden" name="slug" value={post.slug} />
                <input
                  type="hidden"
                  name="publish"
                  value={post.published ? "" : "1"}
                />
                <button
                  type="submit"
                  title={post.published ? "להסתיר מהאתר" : "לפרסם באתר"}
                  className={
                    post.published
                      ? "inline-block rounded-full bg-accent-deep px-3 py-0.5 text-sm text-on-accent"
                      : "inline-block rounded-full border border-line bg-sand px-3 py-0.5 text-sm text-ink-muted"
                  }
                >
                  {post.published ? "מפורסם" : "טיוטה"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
