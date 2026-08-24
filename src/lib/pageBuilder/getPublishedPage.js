// src/lib/pageBuilder/getPublishedPage.js
import prisma from "@/lib/prisma";

// Returns the Puck `data` for a published Page by slug, or null if it
// doesn't exist yet or isn't published. Used by layout.js files to
// render "site-header"/"site-footer" as page-builder content instead of
// the old hardcoded <Header/>/<Footer/> components.
//
// Returning null (rather than throwing) is deliberate: before you've
// built and published a site-header/site-footer page in admin, this
// should render nothing at that spot, not crash the whole site.
export async function getPublishedPageData(slug) {
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || page.status !== "published") return null;
  return page.data;
}
