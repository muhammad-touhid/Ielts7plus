// src/lib/pageBuilder/reservedSlugs.js
//
// Slugs that must never be assignable to a builder Page, because a
// static Next.js route already owns that path segment (or the app
// reserves it structurally). If a Page were ever created with one of
// these slugs, src/app/(public)/[slug]/page.js would never be reached
// for it — Next.js always prefers a matching static folder route over
// a dynamic [slug] route — so the page would silently become
// unreachable with no error anywhere in the app.
//
// NOTE: "home" is deliberately NOT in this list. It's the opposite of
// reserved — it's the one required slug: src/app/(public)/page.js
// fetches the Page row where slug === "home" and renders it at "/".
// Visiting /home directly redirects to / (see [slug]/page.js), but the
// underlying Page row must be allowed to actually have that slug.
//
// Enforced in two places:
//   - Client-side in NewPageForm.js and RenamePageForm.js (nicer UX,
//     catches the mistake before a network round-trip)
//   - Server-side in /api/pages (POST) and /api/pages/[id] (PUT) —
//     this is the actual guarantee, since client-side checks can always
//     be bypassed
export const RESERVED_SLUGS = [
  "about",
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
  "p", // old page-builder route, being removed, but block reuse anyway
];
