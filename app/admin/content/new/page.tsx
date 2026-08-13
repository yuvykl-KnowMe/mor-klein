import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "../post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מאמר חדש",
  robots: { index: false, follow: false },
};

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <Link href="/admin/content" className="text-sm text-ink-muted">
        &rarr; חזרה לרשימת המאמרים
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-bold">מאמר חדש</h1>
      <PostForm post={null} error={error} />
    </main>
  );
}
