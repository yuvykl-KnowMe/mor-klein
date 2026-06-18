// Single source of truth for the blog: each post's slug, title, meta
// description, and one-line card excerpt. The index (/blog) and every post page
// read from here, so a post's title/description live in exactly one place
// (mirrors the lib/site.ts idiom). Add a post here and it appears on the index;
// create the matching app/blog/<slug>/page.tsx to give it a route.

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
};

export const POSTS: BlogPost[] = [
  {
    slug: "adlerian-therapy-explained",
    title: "מה זה בכלל אדלר ולמה זה רלוונטי לחיים שלך?",
    description:
      "הגישה האדלריאנית מסבירה למה אנחנו תקועים בדפוסים ואיך אפשר לשנות אותם. מור קליין, פסיכותרפיסטית אדלריאנית, מסבירה.",
    excerpt:
      "מה עומד מאחורי הגישה האדלריאנית, ולמה היא רלוונטית דווקא לחיים שאתם חיים עכשיו.",
  },
  {
    slug: "what-is-therapy",
    title: "מה זה בכלל טיפול? מה קורה בחדר ולמה זה עובד?",
    description:
      "מה ההבדל בין שיחה עם חבר לשיחה עם מטפל? מה קורה בפגישה הראשונה? מור קליין עונה על השאלות שאנשים לא תמיד מעיזים לשאול.",
    excerpt:
      "מה באמת קורה בחדר הטיפול, ובמה שיחה עם מטפל שונה משיחה טובה עם חבר.",
  },
  {
    slug: "repeating-patterns",
    title: "למה אני ממשיך להיתקל באותם דפוסים שוב ושוב?",
    description:
      "למה אנחנו חוזרים לאותן מערכות יחסים, אותן תגובות, אותן תקיעויות? הסבר מהגישה האדלריאנית.",
    excerpt:
      "למה אנחנו חוזרים שוב ושוב לאותן תגובות ולאותן מערכות יחסים, ומה אפשר לעשות עם זה.",
  },
  {
    slug: "childhood-and-present",
    title: "מה הקשר בין הילדות שלנו לחיים שאנחנו חיים היום?",
    description:
      "הילדות מעצבת את האופן שבו אנחנו רואים את עצמנו ואת העולם — אבל היא לא גזר דין. מור קליין על העבר, ההווה והבחירה.",
    excerpt:
      "איך הילדות מעצבת את הדרך שבה אנחנו רואים את עצמנו, ולמה היא לא גזר דין.",
  },
  {
    slug: "self-criticism",
    title: "למה אנחנו כל כך קשים עם עצמנו?",
    description:
      "ביקורת עצמית נולדה כדי להגן עלינו — אבל לעיתים קרובות היא הופכת למקור של שחיקה. על הקול הפנימי ואיך משנים אותו.",
    excerpt:
      "מאיפה מגיע הקול הביקורתי הפנימי, ואיך אפשר לרכך אותו בלי לאבד מוטיבציה.",
  },
];

// Route path for a post. Used for canonical, openGraph url, and index links so
// the path is built in exactly one place.
export function postPath(slug: string): string {
  return `/blog/${slug}`;
}

// Look up a post by slug for its own page; throws on an unknown slug so a typo
// surfaces at build time rather than rendering an empty page.
export function getPost(slug: string): BlogPost {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) throw new Error(`Unknown blog post slug: ${slug}`);
  return post;
}
