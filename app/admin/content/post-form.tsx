// Shared edit/create form for a blog post. Server component; the only client
// bit is SlugFields (slug auto-suggestion) used for new posts.

import type { SitePost } from "@/lib/blog";
import { postPath } from "@/lib/blog";
import { savePost } from "./actions";
import { SlugFields } from "./slug-fields";

const inputClass = "mt-1 w-full rounded-lg border border-line bg-surface p-3";

const ERROR_MESSAGES: Record<string, string> = {
  title: "חסרה כותרת למאמר.",
  slug: "כתובת המאמר לא תקינה — אותיות אנגליות קטנות, ספרות ומקפים בלבד.",
  exists: "כבר קיים מאמר עם הכתובת הזאת. בחרי כתובת אחרת.",
  db: "השמירה נכשלה. אפשר לנסות שוב בעוד רגע.",
};

export function PostForm({
  post,
  error,
  saved,
}: {
  post: SitePost | null;
  error?: string;
  saved?: boolean;
}) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jerusalem",
  });

  return (
    <form action={savePost} className="mt-6 flex flex-col gap-5">
      <input type="hidden" name="is_new" value={post ? "" : "1"} />
      {post ? (
        <input type="hidden" name="original_slug" value={post.slug} />
      ) : null}

      {saved ? (
        <p className="rounded-lg border border-line bg-sand p-3 text-sm">
          נשמר. השינויים כבר באתר.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-line bg-sand p-3 text-sm">
          {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.db}
        </p>
      ) : null}

      {post ? (
        <>
          <label className="block">
            <span className="text-sm font-semibold">כותרת</span>
            <input
              name="title"
              required
              defaultValue={post.title}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">כתובת המאמר</span>
            <input
              value={postPath(post.slug)}
              readOnly
              disabled
              dir="ltr"
              className={`${inputClass} opacity-60`}
            />
          </label>
        </>
      ) : (
        <SlugFields />
      )}

      <label className="block">
        <span className="text-sm font-semibold">תיאור לגוגל</span>
        <textarea
          name="description"
          rows={2}
          defaultValue={post?.description ?? ""}
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-ink-muted">
          משפט-שניים שיופיעו בתוצאות החיפוש.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold">תקציר</span>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-ink-muted">
          שורה אחת שמופיעה בכרטיס המאמר בעמוד המאמרים.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold">גוף המאמר</span>
        <textarea
          name="body_md"
          rows={24}
          defaultValue={post?.body_md ?? ""}
          className={`${inputClass} leading-relaxed`}
        />
      </label>

      <div className="rounded-lg border border-line bg-sand p-3 text-sm text-ink-muted">
        <p className="font-semibold text-ink">איך מעצבים את הטקסט:</p>
        <ul className="mt-1 flex list-disc flex-col gap-1 ps-5">
          <li>שורה ריקה בין פסקאות פותחת פסקה חדשה.</li>
          <li>
            שורה שמתחילה ב-<bdi dir="ltr">## </bdi> הופכת לכותרת ביניים.
          </li>
          <li>
            קישור כותבים כך: <bdi dir="ltr">[טקסט הקישור](/blog/some-post)</bdi>
          </li>
          <li>
            שורה שמתחילה ב-<bdi dir="ltr">&gt; </bdi> מוצגת כציטוט מודגש.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">תאריך פרסום</span>
          <input
            type="date"
            name="date_published"
            defaultValue={post?.date_published ?? today}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">תאריך עדכון</span>
          <input
            type="date"
            name="date_modified"
            defaultValue={post?.date_modified ?? today}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
          className="size-4"
        />
        <span className="text-sm font-semibold">מפורסם באתר</span>
      </label>

      <button
        type="submit"
        className="rounded-lg bg-accent-deep px-4 py-3 text-on-accent hover:bg-accent-deeper"
      >
        שמירה
      </button>
    </form>
  );
}
