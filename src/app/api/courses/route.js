import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { genId } from "@/lib/pageBuilder/genId";

// GET all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

// POST create new course
export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const course = await prisma.course.create({
      data: {
        slug: body.slug,
        name: body.name,
        tagline: body.tagline,
        description: body.description,
        icon: body.icon,
        coverImage: body.coverImage || null, // was missing entirely before — create never saved a cover image
        price: body.price,
        salePrice: body.salePrice || null,
        duration: body.duration,
        batchSize: body.batchSize,
        classes: body.classes,
        level: body.level,
        badge: body.badge || null,
        features: body.features,
        highlights: body.highlights,
        whatYouWillLearn: body.whatYouWillLearn,
        published: body.published ?? false,
      },
    });

    // Auto-create the matching builder page at courses/<slug>,
    // published immediately. If a Page with this slug somehow already
    // exists (e.g. course was previously deleted and recreated with
    // the same slug), skip creating a duplicate rather than throwing —
    // the course itself must not fail to save because of this side
    // effect.
    const pageSlug = `courses/${course.slug}`;
    try {
      const existingPage = await prisma.page.findUnique({
        where: { slug: pageSlug },
      });

      if (!existingPage) {
        const pageContent = {
          content: [
            {
              type: "CourseDetail",
              props: {
                id: genId("coursedetail"),
                courseSlug: course.slug,
              },
            },
          ],
          root: { props: { title: course.name } },
          zones: {},
        };

        await prisma.page.create({
          data: {
            title: course.name,
            slug: pageSlug,
            status: "published",
            data: pageContent,
            draftData: null,
          },
        });
      }
    } catch (pageError) {
      // Log but don't fail course creation over this — the admin can
      // still create the page manually from /admin/pages if needed.
      console.error("Failed to auto-create course page:", pageError);
    }

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
