import prisma from "@/lib/prisma";

// TODO: set this to your real production domain in Vercel env vars.
// I noticed your event content references www.ielts7plus.co.uk, which
// may be your actual custom domain rather than the *.vercel.app one —
// worth double-checking which is canonical before this goes live,
// since an incorrect sitemap URL set actively hurts SEO (search
// engines index the wrong domain).
const SITE_URL =
  process.env.SITE_URL || process.env.AUTH_URL || "https://ielts7plus.co.uk";

// Chrome pages render as part of the layout, never as standalone
// URLs — exclude from the sitemap even though they're published Page
// rows in the DB.
const CHROME_SLUGS = ["site-header", "site-footer"];

export default async function sitemap() {
  const [pages, blogPosts] = await Promise.all([
    prisma.page.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, createdAt: true },
    }),
  ]);

  const entries = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const page of pages) {
    // "home" renders at "/" (handled above) — including it again at
    // "/home" would create a duplicate-content entry pointing at a
    // URL that actually redirects, per your catch-all route's logic.
    if (page.slug === "home" || CHROME_SLUGS.includes(page.slug)) continue;

    entries.push({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly",
      // Nested pages (courses/*, events/*) rank slightly below
      // top-level standalone pages by default — adjust if you'd
      // rather weight courses/events higher.
      priority: page.slug.includes("/") ? 0.7 : 0.8,
    });
  }

  // BlogPost isn't a Page-builder row, so it's queried and mapped
  // separately. Assumes the route is /blog/<slug> — adjust the path
  // below if your actual blog route differs. BlogPost has no
  // updatedAt field, so createdAt is the closest available signal for
  // lastModified.
  for (const post of blogPosts) {
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.createdAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
