import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { genId } from "@/lib/pageBuilder/genId";

function slugify(str) {
  return (
    (str || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "event"
  );
}

// Appends -2, -3, etc. until it finds a slug not already in use.
async function getUniqueEventSlug(base) {
  let slug = base;
  let counter = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const baseSlug = slugify(body.slug || body.title);
    const slug = await getUniqueEventSlug(baseSlug);

    const event = await prisma.event.create({
      data: { ...body, slug },
    });

    // Auto-create the matching builder page at events/<slug>,
    // published immediately — same pattern as the courses route. If a
    // Page with this slug somehow already exists, skip creating a
    // duplicate rather than throwing; the event itself must not fail
    // to save because of this side effect.
    const pageSlug = `events/${event.slug}`;
    try {
      const existingPage = await prisma.page.findUnique({
        where: { slug: pageSlug },
      });

      if (!existingPage) {
        const pageContent = {
          content: [
            {
              type: "EventDetail",
              props: {
                id: genId("eventdetail"),
                eventSlug: event.slug,
              },
            },
          ],
          root: { props: { title: event.title } },
          zones: {},
        };

        await prisma.page.create({
          data: {
            title: event.title,
            slug: pageSlug,
            status: "published",
            data: pageContent,
            draftData: null,
          },
        });
      }
    } catch (pageError) {
      // Log but don't fail event creation over this — the admin can
      // still create the page manually from /admin/pages if needed.
      console.error("Failed to auto-create event page:", pageError);
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
