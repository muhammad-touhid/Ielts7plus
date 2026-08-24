// src/lib/pageBuilder/reservedSlugs.js
//
// Two distinct lists, two distinct purposes:
//
// RESERVED_SLUGS — slugs that must never be assignable to a NEW builder
// Page, because a static Next.js route already owns that path segment.
// If a Page were created with one of these slugs, [slug]/page.js would
// never be reached for it (Next.js always prefers a matching static
// folder route), so the page would silently become unreachable.
//
// PROTECTED_SLUGS — the opposite direction: slugs that DO belong to a
// real, load-bearing builder Page ("home", "site-header",
// "site-footer") that the rest of the app depends on by exact slug
// name. These are blocked from being DELETED or RENAMED AWAY FROM,
// since doing so would blank the homepage or site chrome with no
// warning. Title can still be changed freely — only the slug itself is
// locked once a page has one of these.
export const RESERVED_SLUGS = [
  "band-calculator",
  "batch-schedule",
  "blog",
  "contact",
  "course-fee",
  "courses",
  "events",
  "faq",
  "guides",
  "login",
  "mock-test",
  "success-stories",
  "admin",
  "api",
  "p",
];

export const PROTECTED_SLUGS = ["home", "site-header", "site-footer"];
