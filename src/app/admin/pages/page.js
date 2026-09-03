// src/app/admin/pages/page.js
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import NewPageForm from "./NewPageForm";
import PagesSearchBar from "./PagesSearchBar";
import CategoryAccordion from "./CategoryAccordion";

const CHROME_SLUGS = { "site-header": "Header", "site-footer": "Footer" };

// Groups by the first "/"-separated segment of the slug — e.g.
// "courses/ielts-prep" -> "courses", "events/open-day" -> "events".
// home/site-header/site-footer are pinned into "Site" since they're
// chrome, not content pages, and anything with no "/" at all falls
// into "General Pages" (the catch-all for standalone pages like
// About Us, Contact, etc).
function getCategoryKey(slug) {
  if (slug === "home" || slug in CHROME_SLUGS) return "site";
  if (!slug.includes("/")) return "general";
  return slug.split("/")[0];
}

const CATEGORY_LABELS = {
  site: "Site",
  general: "General Pages",
};

function labelForCategory(key) {
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// Fixed priority for the categories we know about; anything else
// (courses, events, or any future nested-slug category) sorts
// alphabetically in between, with "general" always last.
const CATEGORY_ORDER = ["site"];

function sortCategories(keys) {
  return keys.sort((a, b) => {
    if (a === "general") return 1;
    if (b === "general") return -1;
    const aPriority = CATEGORY_ORDER.indexOf(a);
    const bPriority = CATEGORY_ORDER.indexOf(b);
    if (aPriority !== -1 || bPriority !== -1) {
      return (
        (aPriority === -1 ? 99 : aPriority) -
        (bPriority === -1 ? 99 : bPriority)
      );
    }
    return labelForCategory(a).localeCompare(labelForCategory(b));
  });
}

export default async function AdminPagesList({ searchParams }) {
  const { q } = await searchParams;

  const allPages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });

  const pages = q
    ? allPages.filter((p) =>
        p.title.toLowerCase().includes(q.trim().toLowerCase()),
      )
    : allPages;

  const grouped = {};
  for (const page of pages) {
    const key = getCategoryKey(page.slug);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(page);
  }
  const categoryKeys = sortCategories(Object.keys(grouped));

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pages</h1>

      <NewPageForm />

      <div className="mt-8">
        <PagesSearchBar />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {categoryKeys.length === 0 && (
          <div className="p-6 text-sm text-gray-500 border border-gray-200 rounded-lg bg-white">
            {q
              ? "No pages match your search."
              : "No pages yet. Create your first one above."}
          </div>
        )}
        {categoryKeys.map((key) => (
          <CategoryAccordion
            key={key}
            label={labelForCategory(key)}
            count={grouped[key].length}
            defaultOpen={!!q}
            pages={grouped[key].map((page) => ({
              id: page.id,
              slug: page.slug,
              title: page.title,
              status: page.status,
              hasDraftPending: !!page.draftData && page.status === "published",
              createdAt: page.createdAt,
              createdByName:
                page.createdBy?.name || page.createdBy?.email || null,
              isHome: page.slug === "home",
              isChrome: page.slug in CHROME_SLUGS,
              chromeLabel: CHROME_SLUGS[page.slug],
            }))}
          />
        ))}
      </div>
    </div>
  );
}
